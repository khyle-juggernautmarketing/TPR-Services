import type { MetadataRoute } from 'next'

function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (url) return url.replace(/\/$/, '')
  return 'https://tpr-services.com'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl()
  const lastModified = new Date()

  return [
    { url: site, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
