import { NextResponse } from 'next/server'
import { formatAppointmentDisplay } from '@/lib/appointments'
import { PHONE_PRIMARY } from '@/lib/constants'
import {
  isRateLimited,
  rateLimitKey,
  sanitizeRequestMeta,
  validateLeadSubmission,
} from '@/lib/leadSecurity'
import { isAllowedLeadRequest } from '@/lib/requestSecurity'
import { getLeadSession, reserveAppointmentSlot, updateLeadSession } from '@/lib/store'
import { getWebhookConfig, postToWebhookWithRetry } from '@/lib/webhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
}

const MAX_BODY_BYTES = 8_192

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: JSON_HEADERS })
}

export async function POST(request: Request) {
  if (!isAllowedLeadRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS })
  }

  const config = getWebhookConfig()
  if (!config) {
    console.error('Lead API: invalid or missing webhook configuration')
    return NextResponse.json(
      { error: `Form is not configured on the server. Please call ${PHONE_PRIMARY}.` },
      { status: 500, headers: JSON_HEADERS },
    )
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415, headers: JSON_HEADERS })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413, headers: JSON_HEADERS })
  }

  const limiterKey = rateLimitKey(request)
  if (isRateLimited(limiterKey)) {
    return NextResponse.json(
      { error: `Too many requests. Please wait a few minutes or call ${PHONE_PRIMARY}.` },
      { status: 429, headers: JSON_HEADERS },
    )
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

    const validated = await validateLeadSubmission(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400, headers: JSON_HEADERS })
    }

    const {
      leadSessionId,
      submissionType,
      appointmentStartMs,
      service,
      timeline,
      name,
      email,
      phone,
      address,
      privacyAccepted,
    } = validated.data

    const session = await getLeadSession(leadSessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session expired. Please start again.' }, { status: 400, headers: JSON_HEADERS })
    }

    if (session.webhookSent) {
      return NextResponse.json({ ok: true, alreadySent: true }, { headers: JSON_HEADERS })
    }

    if (submissionType === 'form_only_timeout' && session.appointmentStartMs) {
      return NextResponse.json({ ok: true, skipped: true }, { headers: JSON_HEADERS })
    }

    let bookedStartMs: number | null = null

    if (submissionType === 'with_appointment') {
      if (!appointmentStartMs) {
        return NextResponse.json({ error: 'Appointment required' }, { status: 400, headers: JSON_HEADERS })
      }

      const reserved = await reserveAppointmentSlot(appointmentStartMs)
      if (!reserved) {
        return NextResponse.json(
          { error: 'That time was just booked. Please choose another slot.' },
          { status: 409, headers: JSON_HEADERS },
        )
      }
      bookedStartMs = appointmentStartMs
      session.appointmentStartMs = appointmentStartMs
    }

    const payload: Record<string, unknown> = {
      service,
      timeline,
      name,
      fullName: name,
      email,
      phone,
      address,
      privacyAccepted,
      consent: privacyAccepted,
      source: 'tpr-services-landing',
      submissionType,
      leadComplete: submissionType === 'with_appointment',
      appointmentBooked: submissionType === 'with_appointment',
      submittedAt: new Date().toISOString(),
      referer: sanitizeRequestMeta(request.headers.get('referer')),
      userAgent: sanitizeRequestMeta(request.headers.get('user-agent')),
      leadSessionId,
    }

    if (bookedStartMs) {
      payload.appointmentStart = new Date(bookedStartMs).toISOString()
      payload.appointmentStartMs = bookedStartMs
      payload.appointmentDisplay = formatAppointmentDisplay(bookedStartMs)
      payload.appointmentTimeZone = 'America/New_York'
      payload.appointmentBlockMinutes = 90
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[Lead Trace]', { ...payload, email: '[redacted]', phone: '[redacted]' })
    }

    let res: Response
    try {
      res = await postToWebhookWithRetry(config.url, config.jwtSecret, payload)
    } catch (e) {
      const aborted = e instanceof Error && e.name === 'AbortError'
      console.error('Lead API: webhook unreachable', aborted ? 'timeout' : 'network')
      return NextResponse.json(
        {
          error: aborted
            ? `Request timed out. Please try again or call ${PHONE_PRIMARY}.`
            : `Could not reach our booking system. Please try again or call ${PHONE_PRIMARY}.`,
        },
        { status: 503, headers: JSON_HEADERS },
      )
    }

    if (res.status >= 200 && res.status < 300) {
      session.webhookSent = true
      await updateLeadSession(session)
      return NextResponse.json(
        {
          ok: true,
          appointmentDisplay: bookedStartMs ? formatAppointmentDisplay(bookedStartMs) : null,
        },
        { headers: JSON_HEADERS },
      )
    }

    const errBody = await res.text().catch(() => '')
    console.error('Lead API: webhook rejected request', res.status, errBody.slice(0, 200))

    return NextResponse.json(
      {
        error:
          res.status === 401 || res.status === 403
            ? `Form authentication failed on the server. Please call ${PHONE_PRIMARY}.`
            : `Our booking system could not process your request. Please call ${PHONE_PRIMARY}.`,
      },
      { status: 502, headers: JSON_HEADERS },
    )
  } catch {
    console.error('Lead API: unexpected error')
    return NextResponse.json(
      { error: `Server error. Please call ${PHONE_PRIMARY}.` },
      { status: 500, headers: JSON_HEADERS },
    )
  }
}
