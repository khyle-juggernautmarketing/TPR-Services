import {
  type AppointmentBlock,
  createBlockFromStart,
  isValidBookableStart,
  pruneExpiredBlocks,
} from '@/lib/appointments'
import type { LeadFormData } from '@/lib/leadSecurity'

const BLOCKS_KEY = 'tpr:appointment_blocks'
const SESSION_PREFIX = 'tpr:lead_session:'

export type LeadSessionRecord = {
  id: string
  data: LeadFormData
  webhookSent: boolean
  appointmentStartMs: number | null
  createdAt: number
  expiresAt: number
}

type MemoryGlobal = {
  map: Map<string, string>
}

function memory(): Map<string, string> {
  const g = globalThis as typeof globalThis & { __tpr_memory_store__?: MemoryGlobal }
  if (!g.__tpr_memory_store__) g.__tpr_memory_store__ = { map: new Map() }
  return g.__tpr_memory_store__.map
}

function hasRedis(): boolean {
  return Boolean(process.env.KV_REST_API_URL?.trim() && process.env.KV_REST_API_TOKEN?.trim())
}

async function redisCommand<T>(command: unknown[]): Promise<T> {
  const url = process.env.KV_REST_API_URL!.trim()
  const token = process.env.KV_REST_API_TOKEN!.trim()
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`KV request failed: ${res.status}`)
  const json = (await res.json()) as { result?: T }
  return json.result as T
}

async function storeGet(key: string): Promise<string | null> {
  if (!hasRedis()) return memory().get(key) ?? null
  try {
    const result = await redisCommand<string | null>(['GET', key])
    return result
  } catch (e) {
    console.error('storeGet fallback to memory', e)
    return memory().get(key) ?? null
  }
}

async function storeSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (!hasRedis()) {
    memory().set(key, value)
    return
  }
  try {
    const cmd = ttlSeconds
      ? ['SET', key, value, 'EX', ttlSeconds]
      : ['SET', key, value]
    await redisCommand(cmd)
  } catch (e) {
    console.error('storeSet fallback to memory', e)
    memory().set(key, value)
  }
}

export async function getAppointmentBlocks(): Promise<AppointmentBlock[]> {
  const raw = await storeGet(BLOCKS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as AppointmentBlock[]
    if (!Array.isArray(parsed)) return []
    return pruneExpiredBlocks(parsed)
  } catch {
    return []
  }
}

async function saveAppointmentBlocks(blocks: AppointmentBlock[]): Promise<void> {
  const pruned = pruneExpiredBlocks(blocks)
  await storeSet(BLOCKS_KEY, JSON.stringify(pruned), 60 * 60 * 24 * 14)
}

export async function reserveAppointmentSlot(startMs: number): Promise<boolean> {
  const blocks = await getAppointmentBlocks()
  if (!isValidBookableStart(startMs, blocks)) return false

  const block = createBlockFromStart(startMs)
  if (blocks.some((b) => b.startMs === block.startMs)) return false

  const next = [...blocks, block]
  await saveAppointmentBlocks(next)
  return true
}

export async function createLeadSession(data: LeadFormData): Promise<LeadSessionRecord> {
  const id = crypto.randomUUID()
  const now = Date.now()
  const record: LeadSessionRecord = {
    id,
    data,
    webhookSent: false,
    appointmentStartMs: null,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  }
  await storeSet(sessionKey(id), JSON.stringify(record), 60 * 60 * 24)
  return record
}

function sessionKey(id: string) {
  return `${SESSION_PREFIX}${id}`
}

export async function getLeadSession(id: string): Promise<LeadSessionRecord | null> {
  const raw = await storeGet(sessionKey(id))
  if (!raw) return null
  try {
    const record = JSON.parse(raw) as LeadSessionRecord
    if (!record?.id || record.id !== id) return null
    if (Date.now() > record.expiresAt) return null
    return record
  } catch {
    return null
  }
}

export async function updateLeadSession(record: LeadSessionRecord): Promise<void> {
  const ttl = Math.max(60, Math.floor((record.expiresAt - Date.now()) / 1000))
  await storeSet(sessionKey(record.id), JSON.stringify(record), ttl)
}
