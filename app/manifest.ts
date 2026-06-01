import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TPR Services — Roofing & Storm Restoration',
    short_name: 'TPR Services',
    description:
      'Roofing, storm damage restoration, and emergency mitigation in Lilburn, GA and Greater Atlanta.',
    start_url: '/',
    display: 'standalone',
    background_color: '#2596BE',
    theme_color: '#2596BE',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
