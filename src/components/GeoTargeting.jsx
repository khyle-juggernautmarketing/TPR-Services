import { GEO_CITIES } from '@/lib/constants'

export function GeoTargeting() {
  return (
    <section
      id="locations"
      className="border-t border-slate-100 bg-white px-4 py-16 text-center"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
          Proudly Serving the Georgia Metro Area
        </h2>
        <p className="mt-4 text-slate-600">
          Fast local response times across Gwinnett County and Greater Atlanta — emergency crews
          dispatched when minutes matter for storm, leak, and mitigation calls.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {GEO_CITIES.map((city) => {
            const label = city.label ?? city.name
            return (
              <span
                key={city.name}
                className={`cursor-default rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${
                  city.featured
                    ? 'border-tpr-accent bg-tpr-accent/10 font-bold text-slate-900 ring-2 ring-tpr-accent/30'
                    : 'border-slate-200/60 bg-slate-100 text-slate-800 hover:border-tpr-accent/40 hover:bg-tpr-accent/20'
                }`}
              >
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
