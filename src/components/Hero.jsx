import { Check } from 'lucide-react'
import Image from 'next/image'
import { VALUE_PROPS } from '@/lib/constants'
import { MEDIA } from '@/lib/media'
import { LeadForm } from '@/components/LeadForm'
import { NAV_OFFSET } from '@/components/Navbar'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0">
        <Image
          src={MEDIA.heroBg}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-slate-950/40"
          aria-hidden
        />
      </div>

      <div
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 lg:grid-cols-12"
        style={{ paddingTop: `calc(${NAV_OFFSET} + 2rem)` }}
      >
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-tpr-accent/40 bg-tpr-accent/10 px-4 py-1.5 text-xs font-semibold text-tpr-accent shadow-sm backdrop-blur-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-tpr-accent" aria-hidden />
            Minority-Owned & Local — Serving Lilburn, GA
          </span>

          <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-white text-balance sm:text-4xl lg:text-6xl">
            From Leaks to Peaks, Protect Your Home with Trusted{' '}
            <span className="text-tpr-accent">Roofing & Restoration</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            The premier certified contractors in the Georgia Metro Area. Delivering reliable full-scale
            roofing, rapid storm damage restoration, and premium local craftsmanship designed to safeguard
            your asset and restore your peace of mind.
          </p>

          <ul className="mt-8 space-y-3">
            {VALUE_PROPS.map((prop) => (
              <li key={prop} className="flex gap-3 text-sm text-slate-100 sm:text-base">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-tpr-accent" strokeWidth={2.5} aria-hidden />
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
