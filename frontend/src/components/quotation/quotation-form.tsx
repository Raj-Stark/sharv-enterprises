'use client'

import { FormEvent, useCallback, useRef, useState } from 'react'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import type { ProductSummary } from '@/lib/strapi/types'

import { TurnstileWidget } from './turnstile-widget'

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | {
      status: 'success'
      requestNumber: string
      whatsappUrl: string
      whatsappMessage: string
    }
  | { status: 'error'; message: string }

const inputClass =
  'mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-3 focus:ring-blue-100'
const labelClass = 'text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-700'

function stringValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function optionalString(formData: FormData, key: string): string | undefined {
  return stringValue(formData, key) || undefined
}

function createSubmissionToken(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  throw new Error('This browser cannot create a secure quotation reference. Please update the browser and try again.')
}

function validWhatsappUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'wa.me'
  } catch {
    return false
  }
}

export function QuotationForm({
  products,
  endpoint,
  defaultDeliveryDestination,
  defaultProductDocumentId,
  defaultEnquiryType = 'domestic',
  turnstileSiteKey,
}: {
  products: ProductSummary[]
  endpoint: string
  defaultDeliveryDestination?: string
  defaultProductDocumentId?: string
  defaultEnquiryType?: 'domestic' | 'export'
  turnstileSiteKey?: string
}) {
  const [enquiryType, setEnquiryType] = useState<'domestic' | 'export'>(defaultEnquiryType)
  const [selectedProduct, setSelectedProduct] = useState(defaultProductDocumentId ?? '')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [turnstileReset, setTurnstileReset] = useState(0)
  const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' })
  const submissionToken = useRef<string | null>(null)
  const handleTurnstileToken = useCallback((token: string | null) => {
    setCaptchaToken(token)
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const customProductName = stringValue(formData, 'productName')
    const productDocumentId = stringValue(formData, 'productDocumentId')

    if (!productDocumentId && !customProductName) {
      setSubmission({
        status: 'error',
        message: 'Catalogue product select karein ya custom product name enter karein.',
      })
      return
    }

    if (turnstileSiteKey && !captchaToken) {
      setSubmission({ status: 'error', message: 'Security verification complete karein.' })
      return
    }

    try {
      submissionToken.current ??= createSubmissionToken()
    } catch (error) {
      setSubmission({
        status: 'error',
        message: error instanceof Error ? error.message : 'Secure quotation reference create nahi hui.',
      })
      return
    }

    const searchParams = new URLSearchParams(window.location.search)
    const payload = {
      data: {
        submissionToken: submissionToken.current,
        enquiryType,
        fullName: stringValue(formData, 'fullName'),
        whatsappNumber: stringValue(formData, 'whatsappNumber'),
        companyName: optionalString(formData, 'companyName'),
        deliveryDestination: stringValue(formData, 'deliveryDestination'),
        items: [
          {
            productDocumentId: productDocumentId || undefined,
            productName: productDocumentId ? undefined : customProductName,
            sku: productDocumentId ? undefined : optionalString(formData, 'sku'),
            quantity: Number(stringValue(formData, 'quantity')),
            unit: stringValue(formData, 'unit'),
            requirements: optionalString(formData, 'requirements'),
          },
        ],
        sourcePage: window.location.pathname,
        referrer: document.referrer || undefined,
        utmSource: searchParams.get('utm_source') ?? undefined,
        utmMedium: searchParams.get('utm_medium') ?? undefined,
        utmCampaign: searchParams.get('utm_campaign') ?? undefined,
        consentToContact: formData.get('consentToContact') === 'on',
        website: stringValue(formData, 'website'),
        captchaToken: captchaToken ?? undefined,
      },
    }

    setSubmission({ status: 'submitting' })

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await response.json().catch(() => null)) as
        | {
            data?: {
              requestNumber?: string
              whatsappUrl?: string
              whatsappMessage?: string
            }
            error?: { message?: string }
          }
        | null

      if (!response.ok) {
        const fallback =
          response.status === 429
            ? 'Too many attempts. Please wait and try again.'
            : response.status === 503
              ? 'WhatsApp quotation is temporarily unavailable. Please try again later.'
              : 'Request save nahi hui. Form details check karke dobara try karein.'
        throw new Error(body?.error?.message ?? fallback)
      }

      const requestNumber = body?.data?.requestNumber
      const whatsappUrl = body?.data?.whatsappUrl
      const whatsappMessage = body?.data?.whatsappMessage

      if (!requestNumber || !whatsappUrl || !whatsappMessage || !validWhatsappUrl(whatsappUrl)) {
        throw new Error('WhatsApp handoff details receive nahi hui.')
      }

      setSubmission({
        status: 'success',
        requestNumber,
        whatsappUrl,
        whatsappMessage,
      })

      window.setTimeout(() => {
        try {
          window.location.assign(whatsappUrl)
        } catch {
          // The visible success state below provides a manual fallback link.
        }
      }, 150)
    } catch (error) {
      setSubmission({
        status: 'error',
        message: error instanceof Error ? error.message : 'Request save nahi hui.',
      })
      if (turnstileSiteKey) setTurnstileReset((value) => value + 1)
    }
  }

  if (submission.status === 'success') {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-9">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">
          WhatsApp handoff ready
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
          Your enquiry has been saved.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
          Reference: <strong className="text-slate-950">{submission.requestNumber}</strong>. WhatsApp mein prepared
          message review karke <strong className="text-slate-950">Send</strong> tap karein.
        </p>
        <a
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-whatsapp-dark"
          href={submission.whatsappUrl}
        >
          <WhatsAppIcon className="size-4" />
          Open WhatsApp
        </a>
        <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <summary className="cursor-pointer font-bold text-slate-900">Preview prepared message</summary>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-xs leading-6">{submission.whatsappMessage}</pre>
        </details>
      </div>
    )
  }

  return (
    <form
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(12,53,86,0.1)] sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Quick quotation</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-slate-950 sm:text-3xl">Tell us what you need.</h2>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-blue">
          About 1 minute
        </span>
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>Quotation type</legend>
        <div className="mt-2 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          {(['domestic', 'export'] as const).map((type) => (
            <label
              className={`cursor-pointer rounded-lg px-4 py-3 text-center text-xs font-extrabold capitalize transition ${enquiryType === type ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-700 hover:bg-white'}`}
              key={type}
            >
              <input
                checked={enquiryType === type}
                className="sr-only"
                name="enquiryType"
                onChange={() => setEnquiryType(type)}
                type="radio"
                value={type}
              />
              {type === 'domestic' ? 'India enquiry' : 'Export enquiry'}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Full name *
            <input autoComplete="name" className={inputClass} maxLength={120} name="fullName" placeholder="Your name" required />
          </label>
          <label className={labelClass}>
            WhatsApp number *
            <input
              autoComplete="tel"
              className={inputClass}
              inputMode="tel"
              maxLength={30}
              minLength={8}
              name="whatsappNumber"
              placeholder="+91 98765 43210"
              required
              type="tel"
            />
          </label>
          {enquiryType === 'export' && (
            <label className={`${labelClass} sm:col-span-2`}>
              Company name *
              <input autoComplete="organization" className={inputClass} maxLength={200} name="companyName" placeholder="Company or business name" required />
            </label>
          )}
          <label className={`${labelClass} sm:col-span-2`}>
            Product *
            <select
              className={inputClass}
              name="productDocumentId"
              onChange={(event) => setSelectedProduct(event.target.value)}
              value={selectedProduct}
            >
              <option value="">Custom product / not listed</option>
              {products.map((product) => (
                <option key={product.documentId} value={product.documentId}>
                  {product.name}{product.sku ? ` · ${product.sku}` : ''}
                </option>
              ))}
            </select>
          </label>
          {!selectedProduct && (
            <label className={`${labelClass} sm:col-span-2`}>
              Product name *
              <input className={inputClass} maxLength={200} name="productName" placeholder="Product name, SKU or reference" required />
            </label>
          )}
          <label className={labelClass}>
            Quantity and unit *
            <span className="mt-2 grid grid-cols-[minmax(0,1fr)_7.75rem] gap-2">
              <input aria-label="Quantity" className={`${inputClass} !mt-0`} defaultValue="1" min="0.001" name="quantity" required step="0.001" type="number" />
              <select aria-label="Unit" className={`${inputClass} !mt-0 px-3`} defaultValue="piece" name="unit" required>
                <option value="piece">Pieces</option>
                <option value="roll">Rolls</option>
                <option value="pack">Packs</option>
                <option value="box">Boxes</option>
                <option value="set">Sets</option>
                <option value="meter">Metres</option>
                <option value="kilogram">Kilograms</option>
              </select>
            </span>
          </label>
          <label className={labelClass}>
            {enquiryType === 'export' ? 'Destination country *' : 'Delivery city *'}
            <input
              className={inputClass}
              defaultValue={defaultDeliveryDestination}
              maxLength={200}
              name="deliveryDestination"
              placeholder={enquiryType === 'export' ? 'Country or port' : 'City or state'}
              required
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Additional details <span className="font-medium normal-case tracking-normal text-slate-500">(optional)</span>
            <textarea
              className={`${inputClass} min-h-24 resize-y py-3`}
              maxLength={600}
              name="requirements"
              placeholder="Size, application or any special requirement"
            />
          </label>
      </div>

      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label>Website<input autoComplete="off" name="website" tabIndex={-1} /></label>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <label className="flex items-start gap-3 text-xs leading-5 text-slate-600">
          <input className="mt-0.5 size-4 shrink-0 accent-whatsapp" name="consentToContact" required type="checkbox" />
          <span>Sharv Enterprises may save this request and contact me on WhatsApp. *</span>
        </label>
        {turnstileSiteKey && (
          <div className="mt-5">
            <TurnstileWidget
              onToken={handleTurnstileToken}
              resetSignal={turnstileReset}
              siteKey={turnstileSiteKey}
            />
          </div>
        )}
        {submission.status === 'error' && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800" role="alert">
            {submission.message}
          </div>
        )}
        <button
          className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-7 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-whatsapp-dark disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={submission.status === 'submitting' || Boolean(turnstileSiteKey && !captchaToken)}
          type="submit"
        >
          <WhatsAppIcon className="size-4" />
          {submission.status === 'submitting' ? 'Saving enquiry…' : 'Continue to WhatsApp'}
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
          A reference is saved first. You still need to tap Send in WhatsApp.
        </p>
      </div>
    </form>
  )
}
