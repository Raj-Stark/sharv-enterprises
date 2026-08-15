import type { Metadata } from 'next'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { QuotationForm } from '@/components/quotation/quotation-form'
import {
  OFFICIAL_COMPANY_NAME,
  OFFICIAL_WHATSAPP_DISPLAY,
  OFFICIAL_WHATSAPP_URL,
} from '@/lib/business/contact'
import { getStrapiPublicUrl } from '@/lib/strapi/client'
import { getProducts, getSiteSetting } from '@/lib/strapi/queries'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Sharv Enterprises for domestic or export packaging requirements through the tracked WhatsApp quotation flow.',
  alternates: { canonical: '/contact' },
}

const requirementItems = [
  'Product name, SKU or a clear reference photo',
  'Size, width, thickness or required material grade',
  'Quantity and preferred unit',
  'Delivery city, destination country or port',
] as const

const enquirySteps = [
  ['Share the essentials', 'Complete one short requirement form.'],
  ['Receive a reference', 'Your enquiry is recorded before handoff.'],
  ['Continue on WhatsApp', 'Review the prepared message and tap Send.'],
] as const

export default async function ContactPage() {
  const [setting, products] = await Promise.all([
    getSiteSetting().catch(() => null),
    getProducts().catch(() => []),
  ])
  const companyName = setting?.companyName ?? OFFICIAL_COMPANY_NAME
  const directMessage = setting?.defaultInquiryMessage?.trim() ||
    `Hello ${companyName}, I would like to discuss a packaging product requirement.`
  const directWhatsappUrl = `${OFFICIAL_WHATSAPP_URL}?text=${encodeURIComponent(directMessage)}`

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy py-10 text-white sm:py-14 lg:py-16">
        <div className="industrial-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="absolute -right-40 -top-48 size-[36rem] rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.09em] text-white/55">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Contact us</span>
          </nav>

          <div className="mt-7 grid gap-9 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end lg:gap-16">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.11em] text-orange-300">Product and quotation support</p>
              <h1 className="mt-4 max-w-4xl text-[2.55rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem]">
                Tell us what you need. We’ll take it from there.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-blue-100/75 sm:text-base">
                Start a domestic or export enquiry with the product details you already have. We’ll continue the technical discussion on WhatsApp.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-brand-navy transition hover:bg-blue-50" href="#contact-form">
                  Start an enquiry <span className="ml-2" aria-hidden="true">↓</span>
                </a>
                <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-white transition hover:border-white/40 hover:bg-white/10" href={directWhatsappUrl} rel="noreferrer" target="_blank">
                  <WhatsAppIcon className="size-4" />
                  Open WhatsApp directly
                </a>
              </div>
              <p className="mt-4 text-xs font-bold text-blue-100/60">Official WhatsApp · {OFFICIAL_WHATSAPP_DISPLAY}</p>
            </div>

            <aside className="hidden rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-sm lg:block">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-300">What happens next</p>
              <ol className="mt-5 grid gap-4">
                {enquirySteps.map(([title, description], index) => (
                  <li className="grid grid-cols-[2rem_1fr] gap-3" key={title}>
                    <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-extrabold text-brand-navy">{index + 1}</span>
                    <span>
                      <span className="block text-sm font-extrabold text-white">{title}</span>
                      <span className="mt-1 block text-xs leading-5 text-blue-100/60">{description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="scroll-mt-32 bg-brand-surface py-12 sm:py-16 lg:py-20" id="contact-form">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-32">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Start with useful context</p>
            <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-slate-950 sm:text-[2.5rem]">One short form, then WhatsApp.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">The form creates a reference and prepares your message. Add only what is available—remaining details can continue in the conversation.</p>

            <a className="group mt-7 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm transition hover:border-whatsapp hover:bg-whatsapp-soft" href={directWhatsappUrl} rel="noreferrer" target="_blank">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                <WhatsAppIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.09em] text-slate-500">Direct WhatsApp</span>
                <span className="mt-1 block text-sm font-extrabold text-slate-950">{OFFICIAL_WHATSAPP_DISPLAY}</span>
              </span>
              <span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-navy" aria-hidden="true">→</span>
            </a>

            {(setting?.enquiryEmail || setting?.phone) && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {setting.enquiryEmail && (
                  <a className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-brand-blue transition hover:border-brand-blue" href={`mailto:${setting.enquiryEmail}`}>Email · {setting.enquiryEmail}</a>
                )}
                {setting.phone && (
                  <a className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-brand-blue transition hover:border-brand-blue" href={`tel:${setting.phone}`}>Call · {setting.phone}</a>
                )}
              </div>
            )}

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-500">Helpful information</p>
              <ul className="mt-4 grid gap-3">
                {requirementItems.map((item) => (
                  <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-extrabold text-brand-blue">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0">
            <QuotationForm
              endpoint={`${getStrapiPublicUrl()}/api/quotation-requests`}
              products={products}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Prefer to research first?</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-4xl">Find the right starting point.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">Browse the catalogue directly or explore products by their packaging application.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-navy px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-white transition hover:bg-brand-blue" href="/products">Browse products →</Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-brand-navy transition hover:border-brand-blue" href="/applications">View applications →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
