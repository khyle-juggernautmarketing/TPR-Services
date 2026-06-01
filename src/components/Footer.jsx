import Link from 'next/link'
import {
  ADDRESS_SHORT,
  BRAND_NAME,
  EMAIL,
  FOOTER_LINKS,
  FOOTER_TAGLINE,
  PHONE_PRIMARY,
  PHONE_PRIMARY_HREF,
  YEAR_ESTABLISHED,
} from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-16 text-slate-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-white">{BRAND_NAME}</p>
          <p className="mt-4 text-sm leading-relaxed">{FOOTER_TAGLINE}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-tpr-accent">
            Minority-Owned Business · Est. {YEAR_ESTABLISHED}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Navigation</p>
          <ul className="mt-4 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-12 items-center text-sm transition-colors duration-300 hover:text-tpr-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Contact</p>
          <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed">
            <p>{ADDRESS_SHORT}</p>
            <p>
              <a
                href={`mailto:${EMAIL}`}
                className="transition-colors duration-300 hover:text-tpr-accent"
              >
                {EMAIL}
              </a>
            </p>
            <p>
              <a
                href={PHONE_PRIMARY_HREF}
                className="font-semibold text-white transition-colors duration-300 hover:text-tpr-accent"
              >
                {PHONE_PRIMARY}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Operating Standards</p>
          <p className="mt-4 text-sm leading-relaxed">
            <span aria-hidden className="mr-1">
              🕒
            </span>
            Hours: 24 Hours / 7 Days a Week Emergency Outpost Dispatches. Fully Insured and Licensed
            Regional Crews.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs sm:flex-row">
        <p>© 2026 {BRAND_NAME}. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="min-h-12 flex items-center transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="min-h-12 flex items-center transition-colors hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
