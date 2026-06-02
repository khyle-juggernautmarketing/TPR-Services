import { NextResponse } from 'next/server'
import {
  formatDateInTz,
  formatDateLabel,
  getAvailableSlotsForDate,
  getBookableDates,
} from '@/lib/appointments'
import { getAppointmentBlocks } from '@/lib/store'
import { isAllowedLeadRequest } from '@/lib/requestSecurity'
import { isRateLimited, rateLimitKey } from '@/lib/leadSecurity'
import { PHONE_PRIMARY } from '@/lib/constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

export async function GET(request: Request) {
  if (!isAllowedLeadRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS })
  }

  const limiterKey = rateLimitKey(request)
  if (isRateLimited(limiterKey)) {
    return NextResponse.json(
      { error: `Too many requests. Please call ${PHONE_PRIMARY}.` },
      { status: 429, headers: JSON_HEADERS },
    )
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')?.trim() ?? ''
  const bookable = getBookableDates()

  if (!date) {
    return NextResponse.json(
      {
        timeZone: 'America/New_York',
        timeZoneLabel: 'Eastern Time (EST/EDT)',
        bookableDates: bookable.map((d) => ({ value: d, label: formatDateLabel(d) })),
      },
      { headers: JSON_HEADERS },
    )
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !bookable.includes(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400, headers: JSON_HEADERS })
  }

  const blocks = await getAppointmentBlocks()
  const slots = getAvailableSlotsForDate(date, blocks)

  return NextResponse.json(
    {
      date,
      today: formatDateInTz(new Date()),
      timeZone: 'America/New_York',
      slots: slots.map((s) => ({ startMs: s.startMs, start: new Date(s.startMs).toISOString(), label: s.label })),
    },
    { headers: JSON_HEADERS },
  )
}
