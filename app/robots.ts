import type { MetadataRoute } from 'next'

function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (url) return url.replace(/\/$/, '')
  return 'https://tpr-services.com'
}

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl()
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site}/sitemap.xml`,
    host: site.replace(/^https?:\/\//, ''),
  }
}
