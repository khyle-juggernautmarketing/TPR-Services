'use client'

import { CalendarCheck, CheckCircle2, Home, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PHONE_PRIMARY, PHONE_PRIMARY_HREF } from '@/lib/constants'
import { MEDIA } from '@/lib/media'

const STORAGE_KEY = 'tpr_thank_you'

export function ThankYouContent() {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setDetails(JSON.parse(raw))
    } catch {
      setDetails(null)
    }
  }, [])

  const name = details?.name
  const appointmentDisplay = details?.appointmentDisplay

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Image src={MEDIA.heroBg} alt="" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950/95" aria-hidden />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <Link href="/" className="mb-10 inline-block">
          <Image
            src={MEDIA.logoNav}
            alt="TPR Services"
            width={200}
            height={64}
            className="h-14 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-tpr-accent/20 ring-4 ring-tpr-accent/30">
          <CheckCircle2 className="h-12 w-12 text-tpr-accent" strokeWidth={2} aria-hidden />
        </div>

        <h1 className="mt-8 font-display text-3xl font-bold text-white sm:text-4xl">
          {name ? `Thank you, ${name.split(' ')[0]}!` : 'Thank You!'}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-200">
          Your request has been received. Our team will confirm your details shortly.
        </p>

        {appointmentDisplay && (
          <div className="mt-8 w-full rounded-2xl border border-tpr-accent/30 bg-white/10 p-6 text-left backdrop-blur-sm">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-tpr-accent">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Scheduled appointment
            </p>
            <p className="mt-2 font-display text-xl font-bold text-white">{appointmentDisplay}</p>
            <p className="mt-2 text-sm text-slate-300">Eastern Time · 90-minute service window reserved</p>
          </div>
        )}

        <p className="mt-8 text-sm text-slate-400">
          For urgent storm damage, call our 24/7 line anytime.
        </p>

        <a
          href={PHONE_PRIMARY_HREF}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-tpr-accent px-8 text-base font-bold text-white transition-colors hover:bg-tpr-accent-dark"
        >
          <Phone className="h-5 w-5" aria-hidden />
          {PHONE_PRIMARY}
        </a>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
        >
          <Home className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  )
}
