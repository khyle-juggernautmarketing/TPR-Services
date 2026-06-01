'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { PRIVACY_CONSENT_TEXT, PHONE_PRIMARY, PHONE_PRIMARY_HREF } from '@/lib/constants'
import { SERVICE_OPTIONS, TIMELINE_OPTIONS } from '@/lib/formOptions'

const STEPS = [
  { id: 1, title: 'What service do you need?' },
  { id: 2, title: 'How quickly do you require dispatch services?' },
  { id: 3, title: 'Your contact details' },
]

const TOTAL_STEPS = 3

const HTML_TAG = /<[^>]*>/g
const inputClass =
  'min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-800 placeholder:text-slate-400 focus:border-tpr-accent focus:outline-none focus:ring-2 focus:ring-tpr-accent/25 sm:text-sm'

const formShellClass =
  'rounded-2xl border border-white/20 bg-white shadow-2xl shadow-slate-950/25 backdrop-blur-md sm:p-8 p-6'

const initialForm = {
  service: '',
  timeline: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  privacyAccepted: false,
}

function sanitizeInput(value) {
  return value.replace(HTML_TAG, '').replace(/[\u0000-\u001F\u007F]/g, '')
}

function parseApiError(body, status) {
  if (body) {
    if (typeof body.error === 'string' && body.error.trim()) return body.error
    if (typeof body.message === 'string' && body.message.trim()) return body.message
  }
  if (status === 429) {
    return `Too many requests. Please wait a few minutes or call ${PHONE_PRIMARY}.`
  }
  if (status >= 500) {
    return `Our booking system is temporarily unavailable. Please call ${PHONE_PRIMARY}.`
  }
  return `Unable to submit right now. Please call ${PHONE_PRIMARY}.`
}

function useStepAdvanceDelay() {
  const [ms, setMs] = useState(200)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMs(0)
    })
    return () => cancelAnimationFrame(id)
  }, [])
  return ms
}

function SuccessMarks() {
  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full bg-tpr-accent/15 ring-4 ring-tpr-accent/25"
      aria-hidden
    >
      <CheckCircle2 className="h-12 w-12 text-tpr-accent" strokeWidth={2} />
    </div>
  )
}

function IconOption({ opt, selected, onSelect }) {
  const Icon = opt.icon
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 ease-in-out ${
        selected
          ? 'border-tpr-accent bg-tpr-accent/5 ring-2 ring-tpr-accent/25'
          : 'border-slate-200 bg-white hover:border-tpr-accent'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
          selected
            ? 'bg-tpr-accent text-white'
            : 'bg-slate-100 text-slate-600 group-hover:bg-tpr-accent/15 group-hover:text-tpr-accent'
        }`}
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="flex-1 text-sm font-semibold leading-snug text-slate-800">{opt.label}</span>
      {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-tpr-accent" aria-hidden />}
    </button>
  )
}

export function LeadForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const stepAdvanceDelayMs = useStepAdvanceDelay()

  const progress = (step / TOTAL_STEPS) * 100

  const selectService = useCallback(
    (service) => {
      setData((d) => ({ ...d, service }))
      setErrorMsg('')
      setTimeout(() => setStep(2), stepAdvanceDelayMs)
    },
    [stepAdvanceDelayMs],
  )

  const selectTimeline = useCallback(
    (timeline) => {
      setData((d) => ({ ...d, timeline }))
      setErrorMsg('')
      setTimeout(() => setStep(3), stepAdvanceDelayMs)
    },
    [stepAdvanceDelayMs],
  )

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!data.service) {
      setErrorMsg('Please select a service.')
      setStep(1)
      return
    }
    if (!data.timeline) {
      setErrorMsg('Please select a timeline.')
      setStep(2)
      return
    }

    const name = sanitizeInput(data.name.trim())
    const email = sanitizeInput(data.email.trim())
    const phone = sanitizeInput(data.phone.trim())
    const address = sanitizeInput(data.address.trim())

    if (!name || !email || !phone || !address) {
      setErrorMsg('Please fill in all fields.')
      return
    }
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setErrorMsg('Please enter a valid phone number.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email.')
      return
    }
    if (address.length < 5) {
      setErrorMsg('Please enter a valid property address.')
      return
    }
    if (!data.privacyAccepted) {
      setErrorMsg('Please authorize contact to submit your request.')
      return
    }

    const payload = {
      service: data.service,
      timeline: data.timeline,
      name,
      email,
      phone,
      address,
      privacyAccepted: data.privacyAccepted,
      _hp: honeypot,
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[LeadForm submit]', { ...payload, email: '[redacted]', phone: '[redacted]' })
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        credentials: 'same-origin',
      })

      let body = null
      const raw = await res.text()
      if (raw) {
        try {
          body = JSON.parse(raw)
        } catch {
          body = null
        }
      }

      if (!res.ok) {
        setStatus('idle')
        setErrorMsg(parseApiError(body, res.status))
        return
      }

      setData(initialForm)
      setStep(1)
      setStatus('success')
    } catch {
      setStatus('idle')
      setErrorMsg(`Network error. Please try again or call ${PHONE_PRIMARY}.`)
    }
  }

  if (status === 'success') {
    return (
      <div className={formShellClass} role="status" aria-live="polite">
        <div className="animate-form-success flex min-h-[300px] flex-col items-center justify-center text-center">
          <SuccessMarks />
          <h3 className="mt-6 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Request Received!
          </h3>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-600">
            Thank you — our team will reach out shortly. For urgent storm damage, call{' '}
            <a
              href={PHONE_PRIMARY_HREF}
              className="font-semibold text-tpr-accent underline decoration-tpr-accent/50 underline-offset-2 hover:text-tpr-accent-dark"
            >
              {PHONE_PRIMARY}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-8 min-h-12 rounded-xl bg-tpr-accent px-8 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:bg-tpr-accent-dark focus:outline-none focus:ring-2 focus:ring-tpr-accent/40 focus:ring-offset-2"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={formShellClass}>
      <div className="mb-5 text-center">
        <h3 className="font-display text-lg font-bold text-slate-900 sm:text-xl">Get Your Free Quote</h3>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Three quick steps — no obligation.</p>
      </div>

      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-tpr-accent transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Step ${step} of ${TOTAL_STEPS}`}
        />
      </div>

      <div key={step} className="animate-form-step">
        <p className="mb-3 text-sm font-semibold text-slate-800">{STEPS[step - 1].title}</p>

        {step === 1 && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((opt) => (
              <IconOption
                key={opt.value}
                opt={opt}
                selected={data.service === opt.value}
                onSelect={() => selectService(opt.value)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-2.5">
            {TIMELINE_OPTIONS.map((opt) => (
              <IconOption
                key={opt.value}
                opt={opt}
                selected={data.timeline === opt.value}
                onSelect={() => selectTimeline(opt.value)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submit} className="space-y-3">
            <label className="sr-only" aria-hidden>
              Website
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Full Name</span>
              <input
                required
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: sanitizeInput(e.target.value) })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: sanitizeInput(e.target.value) })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Phone Number</span>
              <input
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: sanitizeInput(e.target.value) })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Address</span>
              <input
                required
                autoComplete="street-address"
                value={data.address}
                onChange={(e) => setData({ ...data, address: sanitizeInput(e.target.value) })}
                placeholder="Street address, city, state, zip"
                className={inputClass}
              />
            </label>
            <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input
                type="checkbox"
                required
                checked={data.privacyAccepted}
                onChange={(e) => setData({ ...data, privacyAccepted: e.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-tpr-accent focus:ring-tpr-accent"
              />
              <span className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">{PRIVACY_CONSENT_TEXT}</span>
            </label>
            {errorMsg && (
              <p className="text-sm text-red-600" role="alert">
                {errorMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-tpr-accent text-sm font-bold text-white transition-all duration-300 ease-in-out hover:bg-tpr-accent-dark disabled:opacity-70"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Sending...
                </>
              ) : (
                'Submit Free Quote Request'
              )}
            </button>
          </form>
        )}
      </div>

      {errorMsg && step !== 3 && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      {step > 1 && (
        <div className="mt-4 border-t border-slate-200/60 pt-3">
          <button
            type="button"
            onClick={() => {
              setErrorMsg('')
              setStep((s) => Math.max(1, s - 1))
            }}
            className="flex min-h-12 items-center text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-slate-900"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
