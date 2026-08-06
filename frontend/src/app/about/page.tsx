import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { getMediaUrl } from '@/lib/strapi/client'
import { getHomepageProducts } from '@/lib/strapi/queries'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Sharv Enterprises and our focused approach to mechanical sealing products for domestic and export buyers.',
  alternates: { canonical: '/about' },
}

const services = [
  {
    title: 'Mechanical sealing products',
    description: 'Explore a focused catalogue with product references, images and published technical information.',
    icon: (
      <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v8.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Application-led guidance',
    description: 'Start with the pump, mixer or equipment application and review the relevant published options.',
    icon: (
      <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="m9 15 1.8-4.2L15 9l-1.8 4.2L9 15Z" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Domestic & export enquiries',
    description: 'Share quantity, destination and requirement details through one tracked WhatsApp quotation flow.',
    icon: (
      <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
        <path d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
] as const

const workSteps = [
  ['Understand the requirement', 'Product reference, equipment, dimensions, quantity and destination provide the starting context.'],
  ['Review the published options', 'Catalogue and application pages help narrow the conversation before quotation.'],
  ['Confirm technical suitability', 'Final dimensions, materials and operating conditions are checked against the actual requirement.'],
  ['Discuss supply', 'Domestic or export supply details are then handled through the tracked enquiry reference.'],
] as const

const principles = [
  ['Clear information', 'Product pages are structured to make important references easier to review.'],
  ['Requirement first', 'The buyer’s actual application remains more important than a generic product match.'],
  ['One enquiry path', 'Quotation requests use a tracked WhatsApp flow instead of scattered contact links.'],
  ['Technical confirmation', 'Published information supports discovery; final suitability is confirmed separately.'],
] as const

export default async function AboutPage() {
  const products = await getHomepageProducts().catch(() => [])
  const featuredProduct = products[0]
  const featuredImage = getMediaUrl(featuredProduct?.coverImage?.url)

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy py-14 text-white sm:py-20">
        <div className="industrial-grid absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">About us</span>
          </nav>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl">About Sharv Enterprises</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
            A focused B2B source for mechanical sealing products, technical product discovery and structured domestic or export enquiries.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative min-h-[22rem] overflow-hidden rounded-2xl bg-[#eef3f5] sm:min-h-[30rem]">
            {featuredImage ? (
              <Image
                alt={featuredProduct?.coverImage.alternativeText ?? featuredProduct?.name ?? 'Mechanical sealing product'}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={featuredImage}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center p-12">
                <Image alt="Sharv Enterprises" className="h-auto w-full" height={600} src="/brand/sharv-enterprises-logo-transparent.png" width={1800} />
              </div>
            )}
            <div className="absolute inset-x-5 bottom-5 rounded-xl bg-white/95 p-5 shadow-lg backdrop-blur sm:inset-x-7 sm:bottom-7">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Our focus</p>
              <p className="mt-2 text-lg font-black text-black">Mechanical sealing products for pumps and rotating equipment.</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Who we are</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Product information that leads to a better enquiry.</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>Sharv Enterprises serves buyers looking for mechanical sealing products for pumps, mixers and other rotating equipment.</p>
              <p>Our website brings product references, application context and enquiry information together so buyers can review useful details before starting a quotation conversation.</p>
              <p>For domestic and export requirements, the final product suitability and supply terms are reviewed against the actual operating and commercial requirement.</p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Structured product catalogue', 'Application-based discovery', 'Domestic supply enquiries', 'Export requirement support'].map((item) => (
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800" key={item}>
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-navy text-[10px] text-white">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <Link className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-black px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-brand-navy" href="/products">
              View our products →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f6f8fa] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">What we do</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">How we support product discovery</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">A simple catalogue-to-enquiry experience for buyers who already have a reference and those starting from an application.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article className="rounded-xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]" key={service.title}>
                <span className="grid size-14 place-items-center rounded-xl bg-[#e8eff5] text-brand-navy">{service.icon}</span>
                <h3 className="mt-6 text-xl font-black text-black">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Our approach</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">A straightforward buying conversation.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">The process begins with the requirement—not with unsupported product claims. Clear initial information makes technical and commercial review more useful.</p>
          </div>
          <ol className="divide-y divide-slate-200 border-y border-slate-200">
            {workSteps.map(([title, description], index) => (
              <li className="grid gap-4 py-6 sm:grid-cols-[3.5rem_0.8fr_1.2fr] sm:items-start" key={title}>
                <span className="font-mono text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-base font-black text-black">{title}</h3>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-brand-navy py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(([title, description]) => (
              <article className="border-l border-white/20 pl-5" key={title}>
                <h3 className="text-base font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7f9] py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Have a product requirement?</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Share the essentials and continue the conversation on WhatsApp.</h2>
          </div>
          <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-whatsapp-dark" href="/quote">
            <WhatsAppIcon className="size-4" />
            Request a quotation
          </Link>
        </div>
      </section>
    </main>
  )
}
