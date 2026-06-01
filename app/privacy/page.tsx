import Link from 'next/link'
import { BRAND_NAME, EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <article className="prose prose-slate mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-tpr-accent hover:underline">
          ← Back to home
        </Link>
        <h1 className="font-display mt-6 text-3xl font-bold">Privacy Policy</h1>
        <p className="text-slate-600">Last updated: June 1, 2026</p>

        <section className="mt-8 space-y-4 text-slate-700">
          <p>
            {BRAND_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This
            placeholder policy describes how we collect, use, and protect information submitted through
            our website and lead forms.
          </p>
          <h2 className="text-xl font-bold text-slate-900">Information we collect</h2>
          <p>
            When you request a quote, we may collect your name, email, phone number, zip code, service
            preferences, and timeline information you provide voluntarily.
          </p>
          <h2 className="text-xl font-bold text-slate-900">How we use information</h2>
          <p>
            We use your information to respond to inquiries, schedule inspections, coordinate insurance
            claims assistance, and deliver services you request.
          </p>
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p>
            Questions about this policy may be directed to{' '}
            <a href={`mailto:${EMAIL}`} className="text-tpr-accent hover:underline">
              {EMAIL}
            </a>
            .
          </p>
          <p className="text-sm text-slate-500">
            This page is a placeholder. Consult legal counsel for a production-ready privacy policy
            aligned with CCPA and applicable state requirements.
          </p>
        </section>
      </article>
    </div>
  )
}
