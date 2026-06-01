export const BRAND_NAME = 'TPR Services'

/** Logo / brand primary blue */
export const BRAND_PRIMARY = '#2596BE'

export const PHONE_PRIMARY = '(470) 478-8799'
export const PHONE_PRIMARY_HREF = 'tel:+14704788799'

export const EMAIL = 'office@tpr-services.com'

export const ADDRESS = '4485 Lawrenceville Hwy., Ste. 208-1020, Lilburn, Georgia 30047'
export const ADDRESS_SHORT = '4485 Lawrenceville Hwy., Ste. 208-1020, Lilburn, GA 30047'

export const YEAR_ESTABLISHED = '2014'
export const EXPERIENCE_LABEL = '12+ Years of Expertise'

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'development') return 'http://127.0.0.1:3000'
  return 'https://tpr-services.com'
}

export const SITE_URL = resolveSiteUrl()

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Locations', href: '#locations' },
]

export const FOOTER_LINKS = NAV_LINKS

export const VALUE_PROPS = [
  '100% Complimentary Professional Inspections & Claim Management Assistance',
  '10+ Year Premium Labor Warranty Included on Replacements',
  'Licensed, Fully Insured, and Bilingual Field Crews',
]

export const TRUST_BADGES = [
  {
    icon: 'Shield',
    tag: 'LOCAL CREDENTIAL',
    title: 'Certified Professional Contractor',
    subtitle: 'GA Insured',
  },
  {
    icon: 'Calendar',
    tag: 'EXPERIENCE MATRIX',
    title: 'Protecting Atlanta Metro Properties',
    subtitle: 'Since 2014',
  },
  {
    icon: 'Languages',
    tag: 'BILINGUAL ENGAGEMENT',
    title: 'Full Support in English, Español',
    subtitle: '& Core Languages',
  },
  {
    icon: 'Award',
    tag: 'WARRANTY SHIELD',
    title: 'Comprehensive 10+ Year',
    subtitle: 'Structural Labor Warranties',
  },
  {
    icon: 'FileCheck',
    tag: 'INSURANCE EXPERTS',
    title: 'Seamless Insurance Property',
    subtitle: 'Claim Management',
  },
]

export const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Schedule Assessment',
    description:
      'Connect with our team online or through our 24/7 emergency restoration lines.',
  },
  {
    step: 2,
    title: 'Precision Inspection',
    description:
      'Expert dispatch crews document exact structural metrics and compile evidence for your property.',
  },
  {
    step: 3,
    title: 'Claims & Quote Coordination',
    description:
      'We review findings, offer fixed line-item pricing data, and support required insurance claim paperwork.',
  },
  {
    step: 4,
    title: 'Professional Build & Restore',
    description:
      'Crews execute efficient structural deployments and leave the worksite completely debris-free.',
  },
]

export const GEO_CITIES = [
  { name: 'Lilburn', featured: true, label: 'Lilburn, GA' },
  { name: 'Atlanta', featured: false },
  { name: 'Lawrenceville', featured: false },
  { name: 'Duluth', featured: false },
  { name: 'Norcross', featured: false },
  { name: 'Snellville', featured: false },
  { name: 'Stone Mountain', featured: false },
  { name: 'Marietta', featured: false },
  { name: 'Roswell', featured: false },
  { name: 'Alpharetta', featured: false },
  { name: 'Tucker', featured: false },
  { name: 'Gwinnett County', featured: false },
  { name: 'Chamblee', featured: false },
  { name: 'Dunwoody', featured: false },
  { name: 'Decatur', featured: false },
]

export const FOOTER_TAGLINE =
  'Raising structural standards, asset values, and protection mechanics across Georgia communities since day one.'

export const ANNOUNCEMENT_TEXT =
  'Storm Damage? Protecting Lilburn & Georgia Metro Homes Since 2014. Call Our 24/7 Response Line:'

export const PRIVACY_CONSENT_TEXT =
  'By clicking submit, you authorize TPR Services to text or call regarding this free quote under CCPA privacy compliance standards.'
