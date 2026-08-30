import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BlogCard } from '@/components/blog/blog-card'
import { CertificationCard } from '@/components/certifications/certification-card'
import { StorefrontHero } from '@/components/home/storefront-hero'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { ProductCard } from '@/components/products/product-card'
import { EmptyState } from '@/components/site/empty-state'
import { SectionHeading } from '@/components/site/section-heading'
import { TestimonialCarousel } from '@/components/testimonials/testimonial-carousel'
import { buildSeoMetadata } from '@/lib/seo/metadata'
import { getMediaUrl } from '@/lib/strapi/client'
import type { ProductSummary } from '@/lib/strapi/types'
import {
  getHomePage,
  getHomepageApplications,
  getHomepageBlogPosts,
  getHomepageCertifications,
  getHomepageProducts,
  getHomepageTestimonials,
} from '@/lib/strapi/queries'

const fallbackHero = {
  eyebrow: 'Packaging · Protection · Security',
  title: 'Packaging that keeps every shipment moving.',
  description:
    'Explore tapes, stretch films, protective packaging and security seals for warehouses, manufacturers and exporters—then send the exact requirement for a quotation.',
}

const fallbackMetadata = {
  title: 'Industrial Packaging Materials & Security Seals',
  description:
    'Explore packaging tapes, stretch films, protective packaging, corrugated boxes and security seals with quotation support for India and export requirements.',
}

const buyingSteps = [
  {
    number: '01',
    label: 'Choose',
    title: 'Select a product',
    description: 'Browse the catalogue, choose a category or enter a custom product requirement.',
    outcome: 'Product context added',
  },
  {
    number: '02',
    label: 'Describe',
    title: 'Add the essentials',
    description: 'Share quantity, dimensions, application and the delivery destination.',
    outcome: 'Requirement made clear',
  },
  {
    number: '03',
    label: 'Continue',
    title: 'Move to WhatsApp',
    description: 'Get an enquiry reference and continue the commercial discussion with full context.',
    outcome: 'Conversation ready',
  },
] as const

const whyChooseUs = [
  {
    number: '01',
    eyebrow: 'Product clarity',
    title: 'See before you enquire',
    description:
      'Clear categories and product pages help your team shortlist the right material before the first message.',
    outcome: 'Faster shortlisting',
  },
  {
    number: '02',
    eyebrow: 'Less repetition',
    title: 'Context stays attached',
    description:
      'Your selected product and requirement travel together, so the discussion does not restart from zero.',
    outcome: 'Cleaner handoff',
  },
  {
    number: '03',
    eyebrow: 'Trade-ready',
    title: 'Built for India and export',
    description:
      'One quotation path captures the destination details needed for India and export requirements.',
    outcome: 'Relevant quote details',
  },
] as const

const exportMarkets = [
  { name: 'Germany', shortName: 'Germany', flag: '🇩🇪' },
  { name: 'United Kingdom', shortName: 'UK', flag: '🇬🇧' },
  { name: 'United Arab Emirates', shortName: 'UAE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', shortName: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Qatar', shortName: 'Qatar', flag: '🇶🇦' },
  { name: 'Kuwait', shortName: 'Kuwait', flag: '🇰🇼' },
  { name: 'Bahrain', shortName: 'Bahrain', flag: '🇧🇭' },
  { name: 'Nepal', shortName: 'Nepal', flag: '🇳🇵' },
  { name: 'Bangladesh', shortName: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Sri Lanka', shortName: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Singapore', shortName: 'Singapore', flag: '🇸🇬' },
] as const

function cleanCategoryName(value: string): string {
  return value
    .trim()
    .replace(/sequrity/gi, 'Security')
    .replace(/meterials/gi, 'Materials')
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage().catch(() => null)

  if (!homePage) {
    return buildSeoMetadata({
      fallbackTitle: fallbackMetadata.title,
      fallbackDescription: fallbackMetadata.description,
      pathname: '/',
    })
  }

  return buildSeoMetadata({
    seo: homePage.seo,
    fallbackTitle: fallbackMetadata.title,
    fallbackDescription: fallbackMetadata.description,
    fallbackImage: homePage.heroImage,
    pathname: '/',
  })
}

export default async function Home() {
  const [
    homePage,
    products,
    applications,
    certifications,
    blogPosts,
    testimonials,
  ] = await Promise.all([
    getHomePage().catch(() => null),
    getHomepageProducts().catch(() => []),
    getHomepageApplications().catch(() => []),
    getHomepageCertifications().catch(() => []),
    getHomepageBlogPosts().catch(() => []),
    getHomepageTestimonials().catch(() => []),
  ])

  const heroImage = homePage?.heroImage ?? products[0]?.coverImage ?? null
  const heroEyebrow = homePage?.heroEyebrow ?? fallbackHero.eyebrow
  const heroTitle = homePage?.heroTitle ?? fallbackHero.title
  const heroDescription = homePage?.heroDescription ?? fallbackHero.description
  const productShowcase = homePage?.productShowcase
  const selectedShowcaseProducts = [
    productShowcase?.primaryProduct,
    productShowcase?.secondaryProduct,
    productShowcase?.tertiaryProduct,
  ].filter((product): product is ProductSummary => Boolean(product?.documentId))
  const selectedShowcaseProductIds = new Set(
    selectedShowcaseProducts.map((product) => product.documentId),
  )
  const showcaseProducts = [
    ...selectedShowcaseProducts,
    ...products.filter(
      (product) => !selectedShowcaseProductIds.has(product.documentId),
    ),
  ].slice(0, 3)
  const featuredCategoryProducts = products
    .filter(
      (product, index, allProducts) =>
        allProducts.findIndex(
          (candidate) => candidate.category.slug === product.category.slug,
        ) === index,
    )
    .slice(0, 4)
  return (
    <main className="overflow-hidden bg-white">
      <StorefrontHero
        description={heroDescription}
        eyebrow={heroEyebrow}
        imageAlt={
          heroImage?.alternativeText ??
          products[0]?.name ??
          'Industrial packaging products'
        }
        imageUrl={getMediaUrl(heroImage?.url)}
        products={showcaseProducts}
        showcaseBadgeEyebrow={productShowcase?.badgeEyebrow?.trim() || 'Built for business'}
        showcaseBadgeTitle={productShowcase?.badgeTitle?.trim() || 'Pack · Protect · Dispatch'}
        showcaseCtaLabel={productShowcase?.ctaLabel?.trim() || 'View all'}
        showcaseFooterEyebrow={productShowcase?.footerEyebrow?.trim() || 'Live catalogue'}
        showcaseFooterText={productShowcase?.footerText?.trim() || 'Compare products. Keep context in your quote.'}
        title={heroTitle}
      />

      {featuredCategoryProducts.length > 0 && (
        <section className="bg-white py-14 sm:py-20" id="categories" aria-labelledby="categories-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div id="categories-title">
                <SectionHeading
                  eyebrow="Shop by category"
                  title="Start with what you need"
                  description="Jump straight into the product family that fits your packing, protection or cargo-security requirement."
                />
              </div>
              <Link className="shrink-0 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="/products#families">
                View all categories <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCategoryProducts.map((product, index) => {
                const imageUrl = getMediaUrl(product.coverImage?.url)

                return (
                  <Link
                    className="group relative min-h-60 overflow-hidden rounded-2xl bg-slate-950 shadow-sm"
                    href={`/products/category/${product.category.slug}`}
                    key={product.category.documentId}
                  >
                    {imageUrl ? (
                      <Image
                        alt={product.coverImage?.alternativeText ?? product.category.name}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        src={imageUrl}
                      />
                    ) : (
                      <div className="industrial-grid absolute inset-0 opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-white/75">Category {String(index + 1).padStart(2, '0')}</span>
                        <h3 className="mt-1 text-xl font-extrabold leading-snug tracking-[-0.015em]">{cleanCategoryName(product.category.name)}</h3>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-lg font-black text-slate-950 transition group-hover:translate-x-1" aria-hidden="true">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-slate-200 bg-brand-surface py-14 sm:py-20" id="featured-products" aria-labelledby="featured-products-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div id="featured-products-title">
              <SectionHeading
                eyebrow="Featured catalogue"
                title="Popular packaging products"
                description="Review product details first, then carry the selected item directly into the quotation flow."
              />
            </div>
            <Link className="shrink-0 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="/products">
              Browse full catalogue <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-9">
            {products.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard headingLevel={3} product={product} key={product.documentId} />
                ))}
              </div>
            ) : (
              <EmptyState
                eyebrow="Packaging selection support"
                actionHref="/quote"
                actionLabel="Share your requirement"
                description="Our featured catalogue is being prepared. Send the product type, dimensions, quantity or an existing reference and our team can begin from your requirement."
                title="Looking for a packaging product?"
              />
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" id="why-choose-us" aria-labelledby="why-choose-us-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div id="why-choose-us-title">
              <SectionHeading
                eyebrow="Why Sharv Enterprises"
                title="Clarity before the conversation"
                description="A product-first experience that helps B2B buyers move from discovery to a useful quotation without losing context."
              />
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Enquiry support types">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-brand-blue">India &amp; export requirements</span>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="relative overflow-hidden rounded-[2rem] bg-brand-navy p-6 text-white shadow-[0_28px_70px_rgba(12,53,86,0.16)] sm:p-8 lg:p-10">
              <div className="industrial-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border border-white/10" />
              <div className="relative">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-300">One continuous enquiry</p>
                <h3 className="mt-4 max-w-xl text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                  The product you choose stays with the request.
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-blue-100/80">
                  Instead of a blank contact form, your quotation begins with useful product and requirement details already attached.
                </p>

                <div className="mt-8 rounded-2xl border border-white/15 bg-white p-4 text-slate-950 shadow-[0_20px_55px_rgba(0,0,0,0.18)] sm:p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl" aria-hidden="true">▣</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Selected catalogue item</p>
                        <p className="mt-1 truncate text-sm font-extrabold text-slate-950">Product reference attached</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.07em] text-emerald-700">Saved</span>
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2" aria-label="Product to WhatsApp handoff">
                    <div className="text-center">
                      <span className="mx-auto grid size-8 place-items-center rounded-full bg-brand-blue text-xs font-black text-white" aria-hidden="true">✓</span>
                      <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.06em] text-slate-600">Product</p>
                    </div>
                    <span className="text-slate-300" aria-hidden="true">→</span>
                    <div className="text-center">
                      <span className="mx-auto grid size-8 place-items-center rounded-full bg-orange-50 text-xs font-black text-orange-700" aria-hidden="true">+</span>
                      <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.06em] text-slate-600">Details</p>
                    </div>
                    <span className="text-slate-300" aria-hidden="true">→</span>
                    <div className="text-center">
                      <span className="mx-auto grid size-8 place-items-center rounded-full bg-whatsapp-soft text-whatsapp-dark" aria-hidden="true"><WhatsAppIcon className="size-4" /></span>
                      <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.06em] text-slate-600">Handoff</p>
                    </div>
                  </div>
                </div>

                <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-navy transition hover:-translate-y-0.5 hover:bg-blue-50" href="/products">
                  Browse products <span className="ml-3" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <div className="min-w-0">
              <div className="mb-3 flex items-center justify-between px-1 lg:hidden" aria-hidden="true">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Buyer benefits</p>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">Swipe to explore →</p>
              </div>
              <div className="-mx-5 grid snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:auto-cols-[58%] sm:px-0 lg:grid-flow-row lg:auto-cols-auto lg:overflow-visible lg:pb-0">
              {whyChooseUs.map((reason) => (
                <article className="snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" key={reason.number}>
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-5">
                    <span className="grid size-11 place-items-center rounded-xl bg-blue-50 font-mono text-[11px] font-black text-brand-blue">
                      {reason.number}
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">{reason.eyebrow}</p>
                      <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-[-0.015em] text-slate-950">{reason.title}</h3>
                      <p className="mt-2 text-[15px] leading-6 text-slate-600">{reason.description}</p>
                      <p className="mt-4 flex items-center gap-2 text-xs font-extrabold text-brand-blue">
                        <span className="grid size-5 place-items-center rounded-full bg-blue-50 text-[10px]" aria-hidden="true">✓</span>
                        {reason.outcome}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-brand-surface py-14 sm:py-20" id="buying-flow" aria-labelledby="process-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center" id="process-title">
            <SectionHeading
              align="center"
              eyebrow="Simple buying flow"
              title="Three steps. No guesswork."
              description="Start with a known product or a custom requirement. We collect the essentials before moving the conversation to WhatsApp."
            />
          </div>

          <ol className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-5">
            {buyingSteps.map((step, index) => (
              <li className="relative flex" key={step.number}>
                <article className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-brand-navy font-mono text-xs font-black text-white shadow-[0_8px_20px_rgba(12,53,86,0.18)]">
                      {step.number}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">
                      {step.label}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold leading-snug tracking-[-0.015em] text-slate-950 sm:text-2xl">{step.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-7 text-slate-600">{step.description}</p>
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                      <span className="grid size-5 place-items-center rounded-full bg-emerald-50 text-[10px] text-emerald-700" aria-hidden="true">✓</span>
                      {step.outcome}
                    </p>
                  </div>
                </article>

                {index < buyingSteps.length - 1 && (
                  <>
                    <span className="absolute -bottom-[18px] left-1/2 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-blue-200 bg-white text-sm font-black text-brand-blue shadow-sm lg:hidden" aria-hidden="true">↓</span>
                    <span className="absolute -right-[18px] top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-blue-200 bg-white text-sm font-black text-brand-blue shadow-sm lg:grid" aria-hidden="true">→</span>
                  </>
                )}
              </li>
            ))}
          </ol>

          <div className="relative mt-6 overflow-hidden rounded-2xl bg-brand-navy px-6 py-6 text-white sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="industrial-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
            <div className="relative max-w-2xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.11em] text-orange-300">Ready when you are</p>
              <h3 className="mt-2 text-xl font-extrabold leading-snug text-white sm:text-2xl">Have the product details? Start the quotation now.</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">You can also enter a custom product if it is not yet available in the catalogue.</p>
            </div>
            <div className="relative mt-5 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-xl bg-whatsapp px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-whatsapp-dark" href="/quote">
                Start enquiry <span className="ml-3" aria-hidden="true">→</span>
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-white/10" href="/products">
                Browse catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="world-dots border-y border-slate-200 bg-[#f5f8fb] py-14 sm:py-20" id="export-countries" aria-labelledby="export-countries-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl" id="export-countries-title">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-blue shadow-sm">
                <span className="text-base" aria-hidden="true">✦</span>
                International enquiries
              </div>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.75rem]">
                Countries we export to
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Start an export requirement for a frequently requested destination. Product availability, documentation and commercial terms are confirmed against the exact country or port.
              </p>
            </div>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-blue px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(25,84,124,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-navy" href="/quote">
              Start an enquiry <span className="ml-3" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {exportMarkets.map((market) => (
              <Link
                aria-label={`Start an export quotation for ${market.name}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(25,84,124,0.12)] sm:p-5"
                href={`/quote?destination=${encodeURIComponent(market.name)}`}
                key={market.name}
              >
                <span className="absolute right-3 top-3 text-sm font-black text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-blue" aria-hidden="true">↗</span>
                <span className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-3xl shadow-inner" aria-hidden="true">
                  {market.flag}
                </span>
                <h3 className="mt-4 text-sm font-extrabold leading-snug text-slate-950 sm:text-base">{market.shortName}</h3>
                <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.07em] text-slate-500">Export enquiry</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-dashed border-blue-200 bg-white/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-extrabold text-slate-950">Your destination is not listed?</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Share the country or destination port and we’ll evaluate the requirement.</p>
            </div>
            <Link className="shrink-0 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="/quote">
              Add another destination <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {applications.length > 0 && (
        <section className="border-y border-slate-200 bg-brand-surface py-14 sm:py-20" aria-labelledby="applications-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div id="applications-title">
                <SectionHeading
                  eyebrow="Shop by use case"
                  title="Start with your application"
                  description="Explore application-led buying paths when a product reference is not available."
                />
              </div>
              <Link className="shrink-0 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="/applications">
                Browse all use cases <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {applications.slice(0, 3).map((application) => {
                const imageUrl = getMediaUrl(application.image?.url)

                return (
                  <Link
                    className="group relative min-h-80 overflow-hidden rounded-2xl bg-slate-950"
                    href={`/applications/${application.slug}`}
                    key={application.documentId}
                  >
                    {imageUrl ? (
                      <Image
                        alt={application.image?.alternativeText ?? application.name}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        src={imageUrl}
                      />
                    ) : (
                      <div className="industrial-grid absolute inset-0 opacity-40" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-white/75">Use case</p>
                      <h3 className="mt-2 text-2xl font-extrabold leading-snug tracking-[-0.015em]">{application.name}</h3>
                      <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-white/80">{application.summary}</p>
                      <span className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-[0.08em]">Explore <span className="ml-2 transition group-hover:translate-x-1" aria-hidden="true">→</span></span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="overflow-hidden border-y border-slate-200 bg-white py-14 sm:py-20" aria-labelledby="testimonials-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8" id="testimonials-title">
            <SectionHeading
              eyebrow="Customer feedback"
              title="What buyers say"
              description="Published customer experiences managed by the Sharv Enterprises team."
            />
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </section>
      )}

      {certifications.length > 0 && (
        <section className="bg-brand-surface py-14 sm:py-20" aria-labelledby="certifications-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div id="certifications-title">
              <SectionHeading
                eyebrow="Compliance"
                title="Published compliance records"
                description="Check each published record, authority and validity."
              />
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {certifications.map((certification) => (
                <CertificationCard certification={certification} key={certification.documentId} />
              ))}
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="bg-white py-14 sm:py-20" aria-labelledby="insights-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div id="insights-title">
                <SectionHeading
                  eyebrow="Buying guides"
                  title="Packaging guides & insights"
                  description="Practical reading for selecting, using and sourcing packaging products."
                />
              </div>
              <Link className="shrink-0 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="/blogs">
                View all articles <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <BlogCard headingLevel={3} key={post.documentId} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-brand-navy" aria-labelledby="quotation-title">
        <div className="relative mx-auto grid max-w-7xl gap-9 overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="industrial-grid absolute inset-0 opacity-10" />
          <div className="relative">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-blue-200">
              Know the product, size or quantity?
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-[2.75rem]" id="quotation-title">
              Share the requirement. We’ll take it from there.
            </h2>
          </div>
          <div className="relative flex min-w-56 flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-whatsapp-dark focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-whatsapp"
              href="/quote"
            >
              <WhatsAppIcon className="size-4" />
              Start quotation
            </Link>
            <Link
              className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
              href="/products"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
