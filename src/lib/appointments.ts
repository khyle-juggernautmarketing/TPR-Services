export const APPOINTMENT_TZ = 'America/New_York'
export const SLOT_INTERVAL_MIN = 15
export const BLOCK_DURATION_MIN = 90
export const BUSINESS_START_HOUR = 8
/** Last bookable start time (7:00 PM Eastern) */
export const BUSINESS_END_HOUR = 19
export const MAX_DAYS_AHEAD = 3
export const PENDING_WEBHOOK_MS = 10 * 60 * 1000

export type AppointmentBlock = {
  startMs: number
  endMs: number
}

type ZonedParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  weekday: string
}

function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split('-').map(Number)
  return { y, m, d }
}

export function formatDateInTz(date: Date, timeZone = APPOINTMENT_TZ): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getZonedParts(date: Date, timeZone = APPOINTMENT_TZ): ZonedParts {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  })
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  const hourRaw = parts.hour === '24' ? '0' : parts.hour
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(hourRaw),
    minute: Number(parts.minute),
    weekday: parts.weekday ?? '',
  }
}

export function zonedTimeToUtc(
  ymd: string,
  hour: number,
  minute: number,
  timeZone = APPOINTMENT_TZ,
): number {
  const { y, m, d } = parseYmd(ymd)
  let guess = Date.UTC(y, m - 1, d, hour + 5, minute, 0)

  for (let i = 0; i < 24; i++) {
    const zp = getZonedParts(new Date(guess), timeZone)
    if (zp.year === y && zp.month === m && zp.day === d && zp.hour === hour && zp.minute === minute) {
      return guess
    }
    const deltaMin =
      (hour - zp.hour) * 60 +
      (minute - zp.minute) +
      (d - zp.day) * 24 * 60 +
      (m - zp.month) * 30 * 24 * 60 +
      (y - zp.year) * 365 * 24 * 60
    guess += deltaMin * 60 * 1000
  }

  return guess
}

export function addCalendarDaysInTz(ymd: string, days: number, timeZone = APPOINTMENT_TZ): string {
  const { y, m, d } = parseYmd(ymd)
  const utc = Date.UTC(y, m - 1, d + days, 12, 0, 0)
  return formatDateInTz(new Date(utc), timeZone)
}

export function isSundayInTz(ymd: string, timeZone = APPOINTMENT_TZ): boolean {
  const ms = zonedTimeToUtc(ymd, 12, 0, timeZone)
  const wd = getZonedParts(new Date(ms), timeZone).weekday
  return wd === 'Sun'
}

export function getBookableDates(now = new Date()): string[] {
  const today = formatDateInTz(now)
  const dates: string[] = []

  for (let offset = 0; offset <= MAX_DAYS_AHEAD; offset++) {
    const ymd = addCalendarDaysInTz(today, offset)
    if (!isSundayInTz(ymd)) dates.push(ymd)
  }

  return dates
}

export function formatDateLabel(ymd: string): string {
  const ms = zonedTimeToUtc(ymd, 12, 0)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: APPOINTMENT_TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(ms))
}

export function formatSlotLabel(startMs: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: APPOINTMENT_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(startMs))
}

export function formatAppointmentDisplay(startMs: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: APPOINTMENT_TZ,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(new Date(startMs))
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

export function isSlotBlocked(startMs: number, blocks: AppointmentBlock[]): boolean {
  const endMs = startMs + BLOCK_DURATION_MIN * 60 * 1000
  return blocks.some((b) => rangesOverlap(startMs, endMs, b.startMs, b.endMs))
}

export function generateSlotStartsForDate(ymd: string): number[] {
  if (isSundayInTz(ymd)) return []

  const slots: number[] = []
  for (let hour = BUSINESS_START_HOUR; hour <= BUSINESS_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_INTERVAL_MIN) {
      if (hour === BUSINESS_END_HOUR && minute > 0) break
      slots.push(zonedTimeToUtc(ymd, hour, minute))
    }
  }
  return slots
}

export function getAvailableSlotsForDate(
  ymd: string,
  blocks: AppointmentBlock[],
  now = new Date(),
): { startMs: number; label: string }[] {
  const bookable = getBookableDates(now)
  if (!bookable.includes(ymd)) return []

  const minLeadMs = 15 * 60 * 1000
  const earliest = now.getTime() + minLeadMs

  return generateSlotStartsForDate(ymd)
    .filter((startMs) => startMs >= earliest)
    .filter((startMs) => !isSlotBlocked(startMs, blocks))
    .map((startMs) => ({ startMs, label: formatSlotLabel(startMs) }))
}

export function isValidBookableStart(startMs: number, blocks: AppointmentBlock[], now = new Date()): boolean {
  if (!Number.isFinite(startMs) || startMs <= 0) return false

  const ymd = formatDateInTz(new Date(startMs))
  const bookable = getBookableDates(now)
  if (!bookable.includes(ymd)) return false
  if (isSundayInTz(ymd)) return false

  const slots = generateSlotStartsForDate(ymd)
  if (!slots.includes(startMs)) return false
  if (startMs < now.getTime() + 15 * 60 * 1000) return false
  if (isSlotBlocked(startMs, blocks)) return false

  return true
}

export function createBlockFromStart(startMs: number): AppointmentBlock {
  return {
    startMs,
    endMs: startMs + BLOCK_DURATION_MIN * 60 * 1000,
  }
}

export function pruneExpiredBlocks(blocks: AppointmentBlock[], now = new Date()): AppointmentBlock[] {
  const cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000
  return blocks.filter((b) => b.endMs > cutoff)
}
