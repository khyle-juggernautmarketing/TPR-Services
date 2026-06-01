import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Inter } from 'next/font/google'
import {
  BRAND_NAME,
  EMAIL,
  EXPERIENCE_LABEL,
  PHONE_PRIMARY,
  SITE_URL,
  YEAR_ESTABLISHED,
} from '@/lib/constants'
import { GEO_CITIES } from '@/lib/constants'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

const defaultDescription =
  'Residential & commercial roofing, storm damage restoration, and emergency mitigation in Lilburn, GA and the Greater Atlanta metro. Minority-owned, fully insured, bilingual crews. Free inspections since 2014.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2596BE',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TPR Services | Roofing & Storm Restoration — Lilburn, GA',
    template: `%s | ${BRAND_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    'roofing contractor Lilburn GA',
    'storm damage restoration Atlanta',
    'roof replacement Gwinnett County',
    'emergency roof tarping',
    'water fire restoration Georgia',
    'insurance claim roofing',
    'commercial roofing Atlanta metro',
  ],
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'TPR Services | Roofing & Storm Restoration',
    description: defaultDescription,
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: BRAND_NAME,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: `${BRAND_NAME} logo` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TPR Services | Roofing & Storm Restoration',
    description: defaultDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  telephone: '+14704788799',
  email: EMAIL,
  description: defaultDescription,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4485 Lawrenceville Hwy., Ste. 208-1020',
    addressLocality: 'Lilburn',
    addressRegion: 'GA',
    postalCode: '30047',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.8901,
    longitude: -84.1429,
  },
  areaServed: GEO_CITIES.map((c) => ({
    '@type': c.name === 'Gwinnett County' ? 'AdministrativeArea' : 'City',
    name: c.label ?? c.name,
  })),
  foundingDate: YEAR_ESTABLISHED,
  priceRange: '$$',
  knowsAbout: [
    'Roof replacement',
    'Storm damage restoration',
    'Emergency mitigation',
    'Insurance claim assistance',
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Minority-Owned Business', value: true },
    { '@type': 'PropertyValue', name: 'Labor Warranty', value: '10+ years' },
    { '@type': 'PropertyValue', name: 'Experience', value: EXPERIENCE_LABEL },
  ],
}

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BRAND_NAME,
  url: SITE_URL,
  description: defaultDescription,
  inLanguage: 'en-US',
  publisher: { '@type': 'Organization', name: BRAND_NAME, logo: `${SITE_URL}/logo.png` },
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `${BRAND_NAME} — Roofing & Storm Restoration`,
  description: defaultDescription,
  url: SITE_URL,
  inLanguage: 'en-US',
  isPartOf: { '@type': 'WebSite', name: BRAND_NAME, url: SITE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
      </head>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-slate-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-tpr-accent"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
