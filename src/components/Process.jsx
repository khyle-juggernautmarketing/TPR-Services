import { PROCESS_STEPS } from '@/lib/constants'

export function Process() {
  return (
    <section id="process" className="bg-slate-50 px-4 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl lg:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Mastering Your Property Project Lifecycle
            </h2>
            <p className="mt-4 text-slate-300">
              From first call to final walkthrough, we deliver efficient, high-quality service without
              cutting corners — so your property is protected and your timeline stays on track.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-tpr-accent/40"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-tpr-accent text-sm font-bold text-white"
                  aria-hidden
                >
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
