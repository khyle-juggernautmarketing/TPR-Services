import { NextResponse } from 'next/server'
import { PHONE_PRIMARY } from '@/lib/constants'
import { validateLeadBody, isRateLimited, rateLimitKey } from '@/lib/leadSecurity'
import { isAllowedLeadRequest } from '@/lib/requestSecurity'
import { createLeadSession } from '@/lib/store'
import { PENDING_WEBHOOK_MS } from '@/lib/appointments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
}

const MAX_BODY_BYTES = 8_192

export async function POST(request: Request) {
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

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415, headers: JSON_HEADERS })
  }

  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413, headers: JSON_HEADERS })
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: JSON_HEADERS })
    }

    const validated = validateLeadBody(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400, headers: JSON_HEADERS })
    }

    const session = await createLeadSession(validated.data)

    return NextResponse.json(
      {
        ok: true,
        leadSessionId: session.id,
        pendingWebhookMs: PENDING_WEBHOOK_MS,
      },
      { headers: JSON_HEADERS },
    )
  } catch {
    return NextResponse.json(
      { error: `Server error. Please call ${PHONE_PRIMARY}.` },
      { status: 500, headers: JSON_HEADERS },
    )
  }
}
