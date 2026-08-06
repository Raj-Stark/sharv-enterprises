import type { Metadata } from 'next'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { getSiteSetting } from '@/lib/strapi/queries'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Sharv Enterprises for domestic or export mechanical sealing product requirements through the tracked WhatsApp quotation flow.',
  alternates: { canonical: '/contact' },
}

const enquiryAreas = [
  {
    title: 'Product enquiry',
    description: 'Ask about a catalogue product using its name, model or SKU.',
    href: '/products',
    action: 'Browse products',
  },
  {
    title: 'Domestic requirement',
    description: 'Share the required quantity and delivery city or state in India.',
    href: '/quote?type=domestic',
    action: 'Start domestic enquiry',
  },
  {
    title: 'Export requirement',
    description: 'Share company, destination country or port and the product requirement.',
    href: '/quote?type=export',
    action: 'Start export enquiry',
  },
] as const

const requirementItems = [
  'Product name, reference or clear photo',
  'Shaft size, drawing or available dimensions',
  'Equipment and operating application',
  'Quantity and delivery destination',
] as const

export default async function ContactPage() {
  const setting = await getSiteSetting().catch(() => null)
  const companyName = setting?.companyName ?? 'Sharv Enterprises'
  const whatsappNumber = setting?.whatsappNumber?.trim()

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy py-14 text-white sm:py-20">
        <div className="industrial-grid absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Contact us</span>
          </nav>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl">Contact {companyName}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">Tell us what you need, where it is required and the available technical details. We’ll start with the right context.</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Get in touch</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">We’re here for product and quotation enquiries.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">For the fastest and most useful response, use the tracked quotation route. Your requirement is saved with a reference before WhatsApp opens.</p>

            <div className="mt-8 space-y-4">
              <Link className="group flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-whatsapp hover:bg-whatsapp-soft" href="/quote">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                  <WhatsAppIcon className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">WhatsApp quotation</span>
                  <span className="mt-1 block text-base font-black text-black">{whatsappNumber ?? 'Start tracked enquiry'}</span>
                </span>
                <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-black">→</span>
              </Link>

              {setting?.enquiryEmail && (
                <a className="group flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-brand-navy hover:bg-[#f3f6f8]" href={`mailto:${setting.enquiryEmail}`}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8eff5] text-brand-navy">
                    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24"><path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.7" /><path d="m5 7.5 7 5 7-5" stroke="currentColor" strokeWidth="1.7" /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Email</span>
                    <span className="mt-1 block break-all text-base font-black text-black">{setting.enquiryEmail}</span>
                  </span>
                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-black">→</span>
                </a>
              )}

              {setting?.phone && (
                <a className="group flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-brand-navy hover:bg-[#f3f6f8]" href={`tel:${setting.phone}`}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8eff5] text-brand-navy">
                    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24"><path d="M7.2 3.8 10 8l-2 2c1.2 2.5 3.1 4.4 5.6 5.6l2-2 4.2 2.8-.8 3.5c-.2.8-.9 1.3-1.7 1.3C9.3 21.2 2.8 14.7 2.8 6.7c0-.8.5-1.5 1.3-1.7l3.1-1.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Phone</span>
                    <span className="mt-1 block text-base font-black text-black">{setting.phone}</span>
                  </span>
                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-black">→</span>
                </a>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-[#f6f8fa] p-6 sm:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Send your requirement</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-black sm:text-3xl">A few details help us understand the enquiry.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">The quotation page is intentionally short. Add whatever information is available; final technical details can continue in the WhatsApp conversation.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {requirementItems.map((item) => (
                <li className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-700" key={item}>
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-navy text-[10px] text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-whatsapp-dark sm:w-auto" href="/quote">
              <WhatsAppIcon className="size-4" />
              Start WhatsApp enquiry
            </Link>
            <p className="mt-4 text-xs leading-5 text-slate-500">Your enquiry is recorded first. You will still need to tap Send after WhatsApp opens.</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f6f8fa] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">How can we help?</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Choose the right starting point</h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {enquiryAreas.map((area, index) => (
              <Link className="group rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-brand-navy hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]" href={area.href} key={area.title}>
                <span className="font-mono text-[10px] font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 text-xl font-black text-black">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{area.description}</p>
                <span className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.11em] text-brand-navy">{area.action}<span className="ml-2 transition group-hover:translate-x-1">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Explore before you enquire</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Not sure which product to ask for?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Browse products or start from the equipment application.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-lg bg-black px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-brand-navy" href="/products">Browse products</Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:border-black" href="/applications">View applications</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
