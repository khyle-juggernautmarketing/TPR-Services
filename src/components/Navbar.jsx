'use client'

import { Menu, Phone, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ANNOUNCEMENT_TEXT,
  BRAND_NAME,
  NAV_LINKS,
  PHONE_PRIMARY,
  PHONE_PRIMARY_HREF,
} from '@/lib/constants'
import { MEDIA } from '@/lib/media'

const RIBBON_H = '2.5rem'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div
        className="bg-tpr-accent py-2 text-center text-xs font-semibold tracking-wide text-white md:text-sm"
        style={{ minHeight: RIBBON_H }}
      >
        <p className="px-3">
          <span aria-hidden className="mr-1">
            🚨
          </span>
          {ANNOUNCEMENT_TEXT}{' '}
          <a
            href={PHONE_PRIMARY_HREF}
            className="whitespace-nowrap font-bold text-white underline decoration-white/70 underline-offset-2 hover:decoration-white"
          >
            {PHONE_PRIMARY}
          </a>
        </p>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          scrolled
            ? 'border-b border-slate-200/60 bg-white/95 shadow-md backdrop-blur-md'
            : 'border-b border-tpr-accent-dark bg-tpr-accent shadow-sm'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 lg:py-4">
          <Link
            href="#"
            className="flex min-h-12 shrink-0 items-center"
            aria-label={`${BRAND_NAME} home`}
          >
            <Image
              src={MEDIA.logoNav}
              alt={BRAND_NAME}
              width={200}
              height={56}
              className={`h-9 w-auto max-w-[12rem] object-contain object-left sm:h-11 sm:max-w-[13.5rem] ${
                scrolled ? '' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
              }`}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative flex min-h-12 items-center text-xs font-bold uppercase tracking-widest transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full ${
                  scrolled
                    ? 'text-slate-600 after:bg-tpr-accent hover:text-slate-900'
                    : 'text-white/90 after:bg-white hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center lg:flex">
            <a
              href={PHONE_PRIMARY_HREF}
              className={`inline-flex min-h-12 min-w-12 animate-pulse items-center gap-2 rounded-xl px-5 text-sm font-bold transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                scrolled
                  ? 'bg-tpr-accent text-white ring-2 ring-tpr-accent/30 hover:bg-tpr-accent-dark'
                  : 'bg-white text-tpr-accent ring-2 ring-white/40 hover:bg-slate-50'
              }`}
              aria-label={`Call now ${PHONE_PRIMARY}`}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden xl:inline">{PHONE_PRIMARY}</span>
              <span className="xl:hidden">Call Now</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`flex min-h-12 min-w-12 items-center justify-center rounded-lg lg:hidden ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <span className="font-display text-lg font-bold text-slate-900">{BRAND_NAME}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg text-slate-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="nav-mobile-link flex min-h-12 items-center rounded-lg px-4 text-base font-semibold text-slate-800 hover:bg-slate-100"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <a
            href={PHONE_PRIMARY_HREF}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-tpr-accent text-sm font-bold text-white ring-2 ring-tpr-accent/50"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {PHONE_PRIMARY}
          </a>
        </div>
      </div>
    </header>
  )
}

export const NAV_OFFSET = 'calc(2.5rem + 4.25rem)'
