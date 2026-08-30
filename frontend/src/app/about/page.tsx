import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { OFFICIAL_WHATSAPP_DISPLAY } from '@/lib/business/contact'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getProductCategories } from '@/lib/strapi/queries'

export const metadata: Metadata = buildPageMetadata({
  title: 'About Sharv Enterprises',
  description:
    'Sharv Enterprises supplies industrial packaging materials for packing, protection and domestic or export dispatch requirements.',
  pathname: '/about',
})

const fallbackProductRange = [
  'Stretch Films',
  'Container Seals',
  'Strapping Rolls',
  'Packaging Tapes',
  'Bubble Wrap',
  'Corrugated Boxes',
] as const

const enquirySteps = [
  {
    title: 'Share the requirement',
    description: 'Send the product type, size or grade, quantity and delivery destination available to you.',
  },
  {
    title: 'Review relevant options',
    description: 'We keep the discussion focused on the product family and specifications connected to your need.',
  },
  {
    title: 'Continue the quotation',
    description: 'Confirm the remaining details and continue the conversation on our official WhatsApp number.',
  },
] as const

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

export default async function AboutPage() {
  const categories = await getProductCategories().catch(() => [])
  const rangeItems = categories.length > 0
    ? categories.slice(0, 6).map((category) => ({
        href: `/products?category=${encodeURIComponent(category.slug)}`,
        label: cleanCatalogueLabel(category.name),
      }))
    : fallbackProductRange.map((label) => ({ href: '/products', label }))

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative border-b border-slate-200 bg-brand-surface">
        <div className="industrial-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-12">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
              <Link className="transition hover:text-brand-blue" href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900">About us</span>
            </nav>

            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.13em] text-orange-600">About Sharv Enterprises</p>
            <h1 className="mt-3 max-w-2xl text-[2.15rem] font-black leading-[1.07] tracking-[-0.04em] text-brand-navy sm:text-[2.7rem] lg:text-5xl">
              Packaging products for everyday operations and export dispatch.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base">
              We supply industrial packaging materials for packing, protection and dispatch requirements across local and export-oriented businesses.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-brand-blue" href="/products#families">
                View product range
                <ArrowIcon />
              </Link>
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-navy transition hover:border-brand-blue" href="/quote">
                <WhatsAppIcon className="size-4 text-whatsapp" />
                Send a requirement
              </Link>
            </div>
          </div>

          <figure className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-[0_24px_60px_rgba(12,53,86,0.14)]">
            <div className="relative aspect-[16/10]">
              <Image
                alt="Stretch-wrapped and strapped cartons prepared beside an export container"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                src="/images/about/export-packaging-dispatch.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3 text-white sm:inset-x-6 sm:bottom-6">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-100">Domestic & export enquiries</p>
                  <p className="mt-1 text-lg font-black">Pack · Protect · Dispatch</p>
                </div>
                <span className="rounded-full border border-white/25 bg-brand-navy/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] backdrop-blur-sm">Industrial packaging</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section className="py-14 sm:py-18 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-orange-600">What we do</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">
              What we supply, and how we work.
            </h2>
          </div>

          <div>
            <div className="space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
              <p>
                Sharv Enterprises is an industrial packaging supplier serving businesses with materials used for packing, protection, unitisation and dispatch.
              </p>
              <p>
                Our range includes stretch films, container seals, strapping rolls, packaging tapes, bubble wrap, corrugated boxes and related products selected according to the buyer&apos;s requirement.
              </p>
              <p>
                We begin with the practical details—product type, size or grade, quantity and delivery destination—so the enquiry stays focused. We support local manufacturers as well as export-oriented businesses, with clear communication from product selection through quotation.
              </p>
              <p className="font-bold text-slate-800">
                Our aim is straightforward: dependable products, transparent communication and long-term working relationships.
              </p>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-black text-slate-950">Product range</h3>
                <Link className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="/products#families">View catalogue →</Link>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {rangeItems.map((item) => (
                  <Link className="flex min-h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:text-brand-blue" href={item.href} key={item.label}>
                    {item.label}
                    <span className="text-slate-400" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-brand-surface py-14 sm:py-18" id="how-we-work">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-orange-600">How enquiries are handled</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">A simple path from requirement to quotation.</h2>
          </div>

          <ol className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-3">
            {enquirySteps.map((step, index) => (
              <li className="border-b border-slate-200 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-7" key={step.title}>
                <span className="font-mono text-xs font-bold text-orange-600">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-black text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-orange-600">Have a packaging requirement?</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">Share the product, quantity and destination.</h2>
            <p className="mt-3 text-sm text-slate-600">Official WhatsApp · {OFFICIAL_WHATSAPP_DISPLAY}</p>
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-whatsapp-dark lg:shrink-0" href="/quote">
            <WhatsAppIcon className="size-4" />
            Request a quotation
          </Link>
        </div>
      </section>
    </main>
  )
}
