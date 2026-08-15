import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { OFFICIAL_WHATSAPP_DISPLAY } from '@/lib/business/contact'
import { getMediaUrl } from '@/lib/strapi/client'
import { getProductCategories, getProducts } from '@/lib/strapi/queries'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how Sharv Enterprises helps buyers discover packaging, protection and security products for domestic and export requirements.',
  alternates: { canonical: '/about' },
}

const buyerBenefits = [
  {
    title: 'A catalogue you can review',
    description: 'Product images, categories and published details help you understand the available range before an enquiry.',
  },
  {
    title: 'Requirement-led conversations',
    description: 'Product type, size, quantity and destination keep the discussion relevant from the first message.',
  },
  {
    title: 'Domestic and export context',
    description: 'The same structured enquiry path captures the commercial details needed for either requirement.',
  },
  {
    title: 'One clear point of contact',
    description: `Continue with Sharv Enterprises on the official WhatsApp number ${OFFICIAL_WHATSAPP_DISPLAY}.`,
  },
] as const

const enquirySteps = [
  ['Share the need', 'Tell us the product or application, required size and approximate quantity.'],
  ['Review the range', 'Use the catalogue to compare relevant product families and available references.'],
  ['Confirm the details', 'Add delivery destination and any specification needed for a useful quotation.'],
  ['Continue on WhatsApp', 'Your enquiry moves into one tracked conversation with a clear reference.'],
] as const

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="m5 10.5 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

export default async function AboutPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getProductCategories().catch(() => []),
  ])
  const featuredProduct = products.find((product) => product.featured) ?? products[0]
  const featuredImage = getMediaUrl(featuredProduct?.coverImage?.url)
  const categoryHighlights = categories.slice(0, 6)

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative bg-brand-navy text-white">
        <div className="industrial-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="absolute -right-32 -top-28 size-96 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -right-10 top-24 size-60 rounded-full bg-brand-blue/25 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[36rem] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
              <Link className="transition hover:text-white" href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">About us</span>
            </nav>

            <p className="mt-10 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-100">
              <span className="h-px w-8 bg-brand-accent" aria-hidden="true" />
              Packaging · Protection · Security
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-[3.75rem]">
              Practical product sourcing, with clearer choices from the start.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              Sharv Enterprises helps domestic and export buyers discover packaging, protection and security products through a focused catalogue and a structured enquiry experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-xs font-extrabold uppercase tracking-[0.09em] text-brand-navy transition hover:bg-blue-50" href="/products">
                Explore products
                <ArrowIcon />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 text-xs font-extrabold uppercase tracking-[0.09em] text-white transition hover:border-white/50 hover:bg-white/8" href="/quote">
                <WhatsAppIcon className="size-4" />
                Start an enquiry
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:justify-self-end">
            <div className="absolute -left-4 top-10 hidden h-[72%] w-2 rounded-full bg-brand-accent lg:block" aria-hidden="true" />
            <div className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#e9eff3] shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:min-h-[31rem]">
              {featuredImage ? (
                <Image
                  alt={featuredProduct?.coverImage.alternativeText ?? featuredProduct?.name ?? 'Sharv Enterprises product'}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  src={featuredImage}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-10">
                  <Image alt="Sharv Enterprises" className="h-auto w-full" height={600} src="/brand/sharv-enterprises-logo-transparent.png" width={1800} />
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-white/92 p-5 text-slate-950 shadow-xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-blue">From our published catalogue</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-lg font-black leading-snug sm:text-xl">{featuredProduct ? cleanCatalogueLabel(featuredProduct.name) : 'Packaging product range'}</p>
                    {featuredProduct?.category?.name ? <p className="mt-1 text-sm text-slate-600">{cleanCatalogueLabel(featuredProduct.category.name)}</p> : null}
                  </div>
                  <Link aria-label="View this product" className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-navy text-white transition hover:bg-brand-blue" href={featuredProduct ? `/products/${featuredProduct.slug}` : '/products'}>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-px max-w-7xl px-5 sm:px-8" aria-label="Catalogue overview">
        <div className="grid overflow-hidden rounded-b-2xl border-x border-b border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:grid-cols-3">
          <div className="border-b border-slate-200 px-6 py-6 sm:border-b-0 sm:border-r sm:px-8">
            <p className="text-3xl font-black tracking-[-0.04em] text-brand-navy">{products.length || 'Live'}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Published products</p>
          </div>
          <div className="border-b border-slate-200 px-6 py-6 sm:border-b-0 sm:border-r sm:px-8">
            <p className="text-3xl font-black tracking-[-0.04em] text-brand-navy">{categories.length || 'Focused'}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Product families</p>
          </div>
          <div className="px-6 py-6 sm:px-8">
            <p className="text-lg font-black text-brand-navy">India + Export</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Enquiry support</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-brand-blue">Who we are</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
              A more useful bridge between browsing and buying.
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
              <p>Industrial product sourcing often starts with incomplete information. Our role is to make that first step easier: show the range clearly, collect the right requirement details and keep the next conversation focused.</p>
              <p>Instead of broad promises, we give buyers a practical path from product discovery to a quotation request for packaging, protection and security needs.</p>
            </div>
            <Link className="mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue transition hover:text-brand-navy" href="/contact">
              Contact Sharv Enterprises
              <ArrowIcon />
            </Link>
          </div>

          <div className="rounded-[1.75rem] bg-brand-surface p-5 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <h3 className="text-xl font-black tracking-[-0.025em] text-slate-950">What buyers can expect</h3>
              <span className="hidden rounded-full bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-blue shadow-sm sm:inline-flex">Clear by design</span>
            </div>
            <div className="divide-y divide-slate-200">
              {buyerBenefits.map((item) => (
                <article className="grid gap-4 py-6 sm:grid-cols-[2.5rem_1fr]" key={item.title}>
                  <span className="grid size-9 place-items-center rounded-full bg-white text-brand-blue shadow-sm"><CheckIcon /></span>
                  <div>
                    <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {categoryHighlights.length ? (
        <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-24" id="range">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-brand-blue">What we work with</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">A focused range for packaging, protection and security.</h2>
              </div>
              <Link className="inline-flex min-h-11 items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue transition hover:text-brand-navy" href="/products#categories">
                View all categories
                <ArrowIcon />
              </Link>
            </div>

            <div className="mt-10 grid snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto pb-4 pr-5 [scrollbar-width:thin] sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:pr-0 sm:snap-none lg:grid-cols-3">
              {categoryHighlights.map((category, index) => (
                <Link className="group min-h-64 snap-start rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:min-h-0" href={`/products/category/${category.slug}`} key={category.documentId}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs font-bold text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-brand-surface text-brand-blue transition group-hover:bg-brand-navy group-hover:text-white"><ArrowIcon /></span>
                  </div>
                  <h3 className="mt-8 text-xl font-black tracking-[-0.025em] text-slate-950">{cleanCatalogueLabel(category.name)}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{category.description || 'Explore the published range and share your requirement for product selection support.'}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 rounded-[1.75rem] bg-brand-navy p-6 text-white sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:p-14">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue-200">Simple buying flow</p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">From a requirement to a useful conversation.</h2>
              <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base">Four clear steps reduce back-and-forth and help us understand what you actually need.</p>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2">
              {enquirySteps.map(([title, description], index) => (
                <li className="bg-[#123e60] p-6 sm:p-7" key={title}>
                  <span className="text-xs font-black text-blue-200">0{index + 1}</span>
                  <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-brand-surface py-14 sm:py-18">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-brand-blue">Have a product requirement?</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">Share the essentials. We’ll take it from there.</h2>
            <p className="mt-3 text-sm text-slate-600">Official WhatsApp · {OFFICIAL_WHATSAPP_DISPLAY}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-xs font-extrabold uppercase tracking-[0.09em] text-white transition hover:bg-whatsapp-dark" href="/quote">
              <WhatsAppIcon className="size-4" />
              Request a quotation
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-xs font-extrabold uppercase tracking-[0.09em] text-slate-800 transition hover:border-brand-blue hover:text-brand-blue" href="/products">
              Browse products
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
