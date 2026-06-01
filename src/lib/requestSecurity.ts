/**
 * Validates that lead form POSTs originate from this site (not third-party browsers).
 */
export function getAllowedHosts(): string[] {
  const hosts = new Set<string>()

  const addFromUrl = (raw?: string) => {
    if (!raw?.trim()) return
    try {
      const url = raw.startsWith('http') ? raw : `https://${raw}`
      hosts.add(new URL(url).host)
    } catch {
      /* ignore invalid */
    }
  }

  addFromUrl(process.env.NEXT_PUBLIC_SITE_URL)
  addFromUrl(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  const extra = process.env.ALLOWED_ORIGIN_HOSTS?.split(',').map((h) => h.trim()) ?? []
  for (const h of extra) {
    if (h) hosts.add(h)
  }

  hosts.add('localhost:3000')
  hosts.add('127.0.0.1:3000')

  return [...hosts]
}

export function isAllowedLeadRequest(request: Request): boolean {
  const allowed = getAllowedHosts()
  const origin = request.headers.get('origin')

  if (origin) {
    try {
      return allowed.includes(new URL(origin).host)
    } catch {
      return false
    }
  }

  const secFetchSite = request.headers.get('sec-fetch-site')
  if (secFetchSite === 'cross-site') return false

  const host = request.headers.get('host')
  if (!host) return process.env.NODE_ENV === 'development'

  return allowed.includes(host)
}
