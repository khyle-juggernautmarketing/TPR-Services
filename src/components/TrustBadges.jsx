import { Award, Calendar, FileCheck, Languages, Shield } from 'lucide-react'
import { TRUST_BADGES } from '@/lib/constants'

const ICON_MAP = {
  Shield,
  Calendar,
  Languages,
  Award,
  FileCheck,
}

export function TrustBadges() {
  return (
    <section className="overflow-hidden border-y border-slate-200/60 bg-white py-8" aria-label="Credentials">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {TRUST_BADGES.map((badge) => {
            const Icon = ICON_MAP[badge.icon] ?? Shield
            return (
              <div
                key={badge.tag}
                className="flex min-w-[200px] shrink-0 snap-center flex-col items-center text-center md:min-w-0 md:max-w-[11rem] md:flex-1"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tpr-accent/15 text-tpr-accent">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tpr-accent">{badge.tag}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{badge.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{badge.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
