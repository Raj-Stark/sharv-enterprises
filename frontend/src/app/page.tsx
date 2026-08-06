import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BlogCard } from '@/components/blog/blog-card'
import { CertificationCard } from '@/components/certifications/certification-card'
import { HorizontalScroller } from '@/components/home/horizontal-scroller'
import {
  StorefrontHeroCarousel,
  type StorefrontHeroSlide,
} from '@/components/home/storefront-hero-carousel'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { ProductCard } from '@/components/products/product-card'
import { EmptyState } from '@/components/site/empty-state'
import { SectionHeading } from '@/components/site/section-heading'
import { TestimonialCarousel } from '@/components/testimonials/testimonial-carousel'
import { buildSeoMetadata } from '@/lib/seo/metadata'
import { getMediaUrl } from '@/lib/strapi/client'
import {
  getHomePage,
  getHomepageApplications,
  getHomepageBlogPosts,
  getHomepageCertifications,
  getHomepageProducts,
  getHomepageTestimonials,
} from '@/lib/strapi/queries'

const fallbackHero = {
  eyebrow: 'Mechanical sealing products',
  title: 'Mechanical seals for pumps, mixers and rotating equipment.',
  description:
    'Compare seal types and technical details. Get a tracked WhatsApp quotation for India or export.',
}

const fallbackMetadata = {
  title: 'Mechanical Seals & Industrial Sealing Solutions',
  description:
    'Explore mechanical sealing products for pumps and rotating equipment, with technical information and quotation support for India and export requirements.',
}

const storeBenefits = [
  {
    number: '01',
    title: 'Technical catalogue',
    description: 'Model, application and specification-led product discovery.',
  },
  {
    number: '02',
    title: 'Product-linked enquiry',
    description: 'Your selected product travels into the quotation flow.',
  },
  {
    number: '03',
    title: 'India & export',
    description: 'Destination and supply context captured from the start.',
  },
  {
    number: '04',
    title: 'Tracked WhatsApp quote',
    description: 'Receive a request reference before WhatsApp opens.',
  },
] as const

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage().catch(() => null)

  if (!homePage) {
    return {
      title: fallbackMetadata.title,
      description: fallbackMetadata.description,
      alternates: { canonical: '/' },
    }
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
  const heroSlides: StorefrontHeroSlide[] = [
    {
      id: 'storefront-intro',
      eyebrow: heroEyebrow,
      title: heroTitle,
      description: heroDescription,
      imageUrl: getMediaUrl(heroImage?.url),
      imageAlt:
        heroImage?.alternativeText ??
        'Mechanical sealing product for rotating equipment',
      primaryHref: '/products',
      primaryLabel: 'Shop catalogue',
      secondaryHref: '/quote',
      secondaryLabel: 'WhatsApp quote',
      secondaryKind: 'whatsapp',
    },
    ...products.slice(0, 3).map((product) => ({
      id: product.documentId,
      eyebrow: product.category.name,
      title: product.name,
      description: product.shortDescription,
      imageUrl: getMediaUrl(product.coverImage?.url),
      imageAlt: product.coverImage?.alternativeText ?? product.name,
      primaryHref: `/products/${product.slug}`,
      primaryLabel: 'View product',
      secondaryHref: `/quote?product=${product.slug}`,
      secondaryLabel: 'Get quote',
      secondaryKind: 'whatsapp' as const,
      reference: product.modelNumber || product.sku,
    })),
  ]

  const primaryCategory = products[0]?.category
  const discoveryLinks = [
    {
      eyebrow: 'Catalogue',
      title: 'All products',
      description: 'Browse the complete product range',
      href: '/products',
    },
    ...(primaryCategory
      ? [
          {
            eyebrow: 'Category',
            title: primaryCategory.name,
            description: 'Explore products in this category',
            href: `/products/category/${primaryCategory.slug}`,
          },
        ]
      : []),
    {
      eyebrow: 'Selection',
      title: 'Shop by application',
      description: 'Start with your equipment or use case',
      href: '/applications',
    },
    {
      eyebrow: 'Knowledge',
      title: 'Technical guides',
      description: 'Read practical product-selection articles',
      href: '/blogs',
    },
  ]

  const deliveryAreas = [...(homePage?.deliveryAreas ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  )
  let nextSectionNumber = 2
  const applicationSectionNumber =
    applications.length > 0 ? nextSectionNumber++ : null
  const deliverySectionNumber =
    deliveryAreas.length > 0 ? nextSectionNumber++ : null
  const testimonialSectionNumber =
    testimonials.length > 0 ? nextSectionNumber++ : null
  const certificationSectionNumber =
    certifications.length > 0 ? nextSectionNumber++ : null
  const blogSectionNumber = blogPosts.length > 0 ? nextSectionNumber++ : null

  return (
    <main>
      <StorefrontHeroCarousel slides={heroSlides} />

      <section className="border-y border-slate-200 bg-white" aria-label="Store navigation">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {discoveryLinks.map((item, index) => (
            <Link
              className="group flex min-h-36 items-center gap-4 border-b border-slate-200 px-5 py-6 transition-colors hover:bg-catalogue-accent-soft sm:border-r lg:border-b-0 lg:last:border-r-0"
              href={item.href}
              key={`${item.href}-${index}`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-black font-mono text-xs font-black text-white transition group-hover:bg-catalogue-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black/45">
                  {item.eyebrow}
                </span>
                <span className="mt-1 block text-base font-black text-black">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-black/55">
                  {item.description}
                </span>
              </span>
              <span className="ml-auto text-xl font-black text-black/25 transition group-hover:translate-x-1 group-hover:text-black" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-surface py-14 sm:py-20" id="featured-products" aria-labelledby="featured-products-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div id="featured-products-title">
              <SectionHeading
                eyebrow="01 · Featured products"
                title="Shop mechanical seals"
                description="Open a product, review its technical information and continue with a product-linked quotation."
              />
            </div>
            <Link className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-black underline decoration-catalogue-accent decoration-2 underline-offset-4" href="/products">
              View complete catalogue →
            </Link>
          </div>

          <div className="mt-7">
            {products.length > 0 ? (
              <HorizontalScroller label="Featured products">
                {products.map((product) => (
                  <div className="w-[82vw] shrink-0 snap-start sm:w-[23rem] lg:w-[28rem]" key={product.documentId}>
                    <ProductCard headingLevel={3} product={product} />
                  </div>
                ))}
              </HorizontalScroller>
            ) : (
              <EmptyState
                eyebrow="Product selection support"
                actionHref="/quote"
                actionLabel="Share your requirement"
                description="Our featured catalogue is being prepared. Send an existing model, dimensions or application details and our team can begin from your requirement."
                title="Looking for a mechanical sealing product?"
              />
            )}
          </div>
        </div>
      </section>

      {applications.length > 0 && (
        <section className="bg-white py-14 sm:py-20" aria-labelledby="applications-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div id="applications-title">
                <SectionHeading
                  eyebrow={`${String(applicationSectionNumber).padStart(2, '0')} · Shop by requirement`}
                  title="Start with your equipment"
                  description="Explore application-led buying paths when a product reference is not available."
                />
              </div>
              <Link className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-black underline decoration-catalogue-accent decoration-2 underline-offset-4" href="/applications">
                Browse all applications →
              </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {applications.slice(0, 3).map((application) => {
                const imageUrl = getMediaUrl(application.image?.url)

                return (
                  <Link
                    className="group relative min-h-[25rem] overflow-hidden rounded-2xl bg-slate-950"
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
                      <div className="industrial-grid absolute inset-0 opacity-35" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                      <span className="inline-flex rounded-full border border-white/20 bg-black/55 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        Shop by use
                      </span>
                      <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white">
                        {application.name}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/65">
                        {application.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center text-xs font-black uppercase tracking-[0.14em] text-white">
                        Explore products <span className="ml-3 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-slate-200 bg-white" aria-label="Store benefits">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {storeBenefits.map((benefit) => (
            <article className="border-b border-slate-200 px-6 py-7 sm:border-r lg:border-b-0 lg:last:border-r-0" key={benefit.number}>
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black font-mono text-[10px] font-black text-white">
                  {benefit.number}
                </span>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.08em] text-black">{benefit.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-black/55">{benefit.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {deliveryAreas.length > 0 && (
        <section className="bg-brand-surface py-14 sm:py-20" aria-labelledby="delivery-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12">
              <div className="industrial-grid absolute inset-0 opacity-15" />
              <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/10" aria-hidden="true" />
              <div className="relative grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
                <div className="max-w-xl" id="delivery-title">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">
                    {homePage?.deliveryEyebrow ?? `${String(deliverySectionNumber).padStart(2, '0')} · Delivery coverage`}
                  </p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                    {homePage?.deliveryTitle ?? 'Domestic supply and export enquiries.'}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/65">
                    {homePage?.deliveryDescription ?? 'Published delivery areas show where requirements can be evaluated. Final availability is confirmed against the product and destination.'}
                  </p>
                  <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-catalogue-accent hover:text-white" href="/quote">
                    Share destination <span className="ml-3" aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {deliveryAreas.map((area, index) => (
                    <article className="rounded-2xl bg-white p-6 text-black" key={area.id}>
                      <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">
                          {area.market === 'export' ? 'Export enquiry' : 'Domestic supply'}
                        </span>
                        <span className="grid size-8 place-items-center rounded-full bg-black font-mono text-[9px] font-black text-white">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-5 text-xl font-black tracking-tight text-black">{area.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-black/60">{area.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="overflow-hidden border-y border-slate-200 bg-white py-14 sm:py-20" aria-labelledby="testimonials-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8" id="testimonials-title">
            <SectionHeading
              eyebrow={`${String(testimonialSectionNumber).padStart(2, '0')} · Testimonials`}
              title="Feedback from our buyers"
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
                eyebrow={`${String(certificationSectionNumber).padStart(2, '0')} · Compliance`}
                title="Published compliance records"
                description="Check each published record, authority and validity."
              />
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div id="insights-title">
                <SectionHeading
                  eyebrow={`${String(blogSectionNumber).padStart(2, '0')} · Buying guides`}
                  title="Technical guides & insights"
                  description="Practical reading for selecting, operating and sourcing seals."
                />
              </div>
              <Link className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-black underline decoration-catalogue-accent decoration-2 underline-offset-4" href="/blogs">
                View all blogs →
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard headingLevel={3} key={post.documentId} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-slate-300 bg-[#e3ebef]" aria-labelledby="quotation-title">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
              Have a seal reference, drawing or application?
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-[-0.04em] text-black sm:text-5xl" id="quotation-title">
              Add the requirement. Continue on WhatsApp.
            </h2>
          </div>
          <div className="flex min-w-56 flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-lg bg-whatsapp px-7 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-whatsapp-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp"
              href="/quote"
            >
              <WhatsAppIcon className="size-4" />
              Start WhatsApp quotation
            </Link>
            <Link
              className="inline-flex min-h-13 items-center justify-center rounded-lg border border-black/20 bg-white px-7 text-xs font-black uppercase tracking-[0.14em] text-black transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
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
