import Link from 'next/link'
import { BRAND_NAME, EMAIL, PHONE_PRIMARY } from '@/lib/constants'

export const metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <article className="prose prose-slate mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-tpr-accent hover:underline">
          ← Back to home
        </Link>
        <h1 className="font-display mt-6 text-3xl font-bold">Terms of Service</h1>
        <p className="text-slate-600">Last updated: June 1, 2026</p>

        <section className="mt-8 space-y-4 text-slate-700">
          <p>
            These placeholder terms govern your use of the {BRAND_NAME} website. By using this site, you
            agree to these terms in their current form.
          </p>
          <h2 className="text-xl font-bold text-slate-900">Services</h2>
          <p>
            Information on this site is for general marketing purposes. Formal scope, pricing, and
            warranties are defined only in signed agreements between you and {BRAND_NAME}.
          </p>
          <h2 className="text-xl font-bold text-slate-900">Limitation of liability</h2>
          <p>
            We strive for accurate content but do not guarantee completeness. {BRAND_NAME} is not liable
            for damages arising from reliance on website content alone.
          </p>
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p>
            Reach us at {EMAIL} or {PHONE_PRIMARY} for questions about these terms.
          </p>
          <p className="text-sm text-slate-500">
            This page is a placeholder. Consult legal counsel before publishing binding terms.
          </p>
        </section>
      </article>
    </div>
  )
}
