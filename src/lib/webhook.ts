import { isAllowedWebhookHost, isValidJwtSecret, isValidWebhookUrl, signJwtHS256 } from '@/lib/jwt'

const WEBHOOK_TIMEOUT_MS = 20_000
const WEBHOOK_MAX_ATTEMPTS = 3

export function getWebhookConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim()
  const jwtSecret = process.env.N8N_JWT_SECRET?.trim()
  if (!url || !jwtSecret) return null
  if (!isValidWebhookUrl(url) || !isValidJwtSecret(jwtSecret) || !isAllowedWebhookHost(url)) {
    return null
  }
  return { url, jwtSecret }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function postToWebhook(url: string, jwtSecret: string, payload: Record<string, unknown>) {
  const token = signJwtHS256(jwtSecret, { sub: 'lead-form' })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    })
  } finally {
    clearTimeout(timeout)
  }
}

export async function postToWebhookWithRetry(url: string, jwtSecret: string, payload: Record<string, unknown>) {
  let lastResponse: Response | null = null
  let lastError: unknown = null

  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt++) {
    try {
      const res = await postToWebhook(url, jwtSecret, payload)
      if (res.status >= 200 && res.status < 300) return res

      lastResponse = res
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        return res
      }
    } catch (error) {
      lastError = error
    }

    if (attempt < WEBHOOK_MAX_ATTEMPTS) {
      await sleep(350 * attempt)
    }
  }

  if (lastResponse) return lastResponse
  throw lastError ?? new Error('Webhook unreachable')
}
