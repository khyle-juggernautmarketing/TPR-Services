import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MEDIA } from '@/lib/media'

const SERVICE_ROWS = [
  {
    title: 'Roof Inspections & Full Replacements',
    description:
      'Comprehensive structural assessments and premium replacement systems engineered for Georgia weather — hail, wind, and heat. We document every detail for insurance clarity and long-term asset protection.',
    cta: 'Schedule Free Inspection',
    image: MEDIA.services.replacement,
    alt: 'Professional roof replacement crew working on a residential home in the Atlanta metro area',
    reverse: false,
  },
  {
    title: 'Emergency Storm & Leak Repair',
    description:
      '24/7 emergency dispatch for storm damage, active leaks, and emergency tarping. Rapid response across Lilburn and Greater Atlanta to prevent interior damage and stabilize your property immediately.',
    cta: 'Call 24/7 Emergency Line',
    image: MEDIA.services.storm,
    alt: 'Emergency storm damage roof repair and tarping service in Georgia',
    reverse: true,
    highlight: true,
  },
  {
    title: 'Flood, Water, Fire & Smoke Restoration',
    description:
      'End-to-end mitigation and restoration when disaster strikes. Our certified crews handle water extraction, structural drying, smoke remediation, and rebuild coordination with your insurance carrier.',
    cta: 'Start Mitigation Assessment',
    image: MEDIA.services.restoration,
    alt: 'Water and fire damage restoration specialists at work on a Georgia property',
    reverse: false,
  },
]

function ServiceImage({ row }) {
  return (
    <div className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-card">
        <Image
          src={row.image}
          alt={row.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}

function ServiceCopy({ row }) {
  return (
    <div>
      {row.highlight && (
        <span className="mb-3 inline-block rounded-full bg-tpr-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-tpr-accent-dark">
          24/7 Emergency Available
        </span>
      )}
      <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{row.title}</h3>
      <p className="mt-4 leading-relaxed text-slate-600">{row.description}</p>
      <Link
        href="#"
        className="group/link mt-6 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-slate-900 transition-colors duration-300 hover:text-tpr-accent"
      >
        {row.cta}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-2"
          aria-hidden
        />
      </Link>
    </div>
  )
}

export function Services() {
  return (
    <section id="services" className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Complete Roofing & Mitigation Solutions
          </h2>
          <p className="mt-4 text-slate-600">
            Weather-proofing, storm recovery, and disaster mitigation services trusted across Gwinnett County
            and the Greater Atlanta metro — built for residential and commercial properties.
          </p>
        </div>

        <div className="mt-14 space-y-16 lg:space-y-24">
          {SERVICE_ROWS.map((row) => (
            <div
              key={row.title}
              className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
            >
              {row.reverse ? (
                <>
                  <ServiceImage row={row} />
                  <ServiceCopy row={row} />
                </>
              ) : (
                <>
                  <ServiceCopy row={row} />
                  <ServiceImage row={row} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
