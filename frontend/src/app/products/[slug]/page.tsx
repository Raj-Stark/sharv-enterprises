import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlogCard } from '@/components/blog/blog-card'
import { BlocksRenderer } from '@/components/content/blocks-renderer'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { ProductGallery, type ProductGalleryImage } from '@/components/products/product-gallery'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqList } from '@/components/site/faq-list'
import { buildSeoMetadata } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/seo/site-url'
import { getMediaUrl } from '@/lib/strapi/client'
import { getProductBySlug } from '@/lib/strapi/queries'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

function sortByOrder<T extends { sortOrder?: number }>(items?: T[]): T[] {
  return [...(items ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  )
}

function formatDate(value?: string | null): string | null {
  if (!value) return null
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function safeExternalUrl(value?: string | null): string | null {
  if (!value || !/^https:\/\//i.test(value)) return null
  return value
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: 'Product not found' }

  return buildSeoMetadata({
    seo: product.seo,
    fallbackTitle: product.name,
    fallbackDescription: product.shortDescription,
    fallbackImage: product.coverImage,
    pathname: `/products/${product.slug}`,
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const coverImageUrl = getMediaUrl(product.coverImage?.url)
  const gallery = (product.gallery ?? []).filter(
    (image) =>
      image.documentId !== product.coverImage?.documentId &&
      image.url !== product.coverImage?.url,
  )
  const productImages = [product.coverImage, ...gallery].reduce<ProductGalleryImage[]>((images, image) => {
    const src = getMediaUrl(image?.url)
    if (src) {
      images.push({
        id: image.documentId,
        src,
        alt: image.alternativeText ?? product.name,
      })
    }
    return images
  }, [])
  const features = sortByOrder(product.features)
  const specifications = sortByOrder(product.specifications)
  const highlightedSpecifications = specifications.filter((specification) => specification.highlighted)
  const quickSpecifications = (highlightedSpecifications.length > 0 ? highlightedSpecifications : specifications).slice(0, 3)
  const specificationGroups = Object.entries(
    specifications.reduce<Record<string, typeof specifications>>((groups, specification) => {
      const group = specification.groupName?.trim() || 'General'
      groups[group] = [...(groups[group] ?? []), specification]
      return groups
    }, {}),
  )
  const faqs = sortByOrder(product.faqs)
  const quoteHref = `/quote?product=${encodeURIComponent(product.slug)}`
  const pageSections = [
    { href: '#overview', label: 'Overview' },
    ...(specifications.length > 0 ? [{ href: '#specifications', label: 'Specifications' }] : []),
    ...(product.certifications && product.certifications.length > 0
      ? [{ href: '#certifications', label: 'Compliance' }]
      : []),
    ...(faqs.length > 0 ? [{ href: '#faqs', label: 'FAQ' }] : []),
  ]

  return (
    <main className="bg-white">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription,
          image: coverImageUrl ?? undefined,
          sku: product.sku ?? undefined,
          model: product.modelNumber ?? undefined,
          category: product.category.name,
          url: getSiteUrl(`/products/${product.slug}`),
        }}
      />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <nav className="flex min-w-0 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500" aria-label="Breadcrumb">
            <Link className="shrink-0 transition hover:text-brand-blue" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link className="shrink-0 transition hover:text-brand-blue" href="/products">Products</Link>
            <span aria-hidden="true">/</span>
            <Link className="hidden truncate transition hover:text-brand-blue sm:block" href={`/products/category/${product.category.slug}`}>
              {product.category.name}
            </Link>
            <span className="hidden sm:inline" aria-hidden="true">/</span>
            <span className="truncate font-extrabold text-slate-800">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="border-b border-slate-200 bg-brand-surface py-6 sm:py-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(27rem,1.1fr)] lg:items-center lg:gap-12">
          <ProductGallery featured={product.featured} images={productImages} productName={product.name} />

          <div>
            <Link className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.09em] text-brand-blue transition hover:border-brand-blue hover:text-brand-navy" href={`/products/category/${product.category.slug}`}>
              {product.category.name} <span aria-hidden="true">→</span>
            </Link>

            <h1 className="mt-4 max-w-2xl text-[2.15rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-[2.7rem] lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {product.shortDescription}
            </p>

            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
              <span><strong className="font-extrabold text-slate-950">Model:</strong> {product.modelNumber ?? 'On request'}</span>
              <span><strong className="font-extrabold text-slate-950">SKU:</strong> {product.sku ?? 'On request'}</span>
            </p>

            <div className="flex flex-col">
            {quickSpecifications.length > 0 && (
              <div className="order-2 mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:order-1">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">At a glance</p>
                  <a className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-blue hover:text-brand-navy" href="#specifications">All specifications ↓</a>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-200 pt-4 sm:grid-cols-3">
                  {quickSpecifications.map((specification) => (
                    <div className="min-w-0" key={specification.id}>
                      <dt className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-500">{specification.label}</dt>
                      <dd className="mt-1 text-sm font-extrabold leading-5 text-slate-950">{specification.value}{specification.unit ? ` ${specification.unit}` : ''}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="order-1 mt-6 flex flex-col gap-4 sm:flex-row sm:items-center lg:order-2">
              <Link
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-whatsapp-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-whatsapp"
                href={quoteHref}
              >
                <WhatsAppIcon className="size-4" />
                Request a quotation
              </Link>
              <Link className="inline-flex min-h-11 items-center justify-center text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue underline decoration-blue-200 underline-offset-4 transition hover:text-brand-navy" href={`/products/category/${product.category.slug}`}>
                More in this category <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="order-1 mt-3 flex items-center gap-2 text-xs leading-5 text-slate-600 lg:order-2"><span className="text-emerald-700" aria-hidden="true">✓</span> Product reference is added automatically. Domestic and export enquiries are supported.</p>
            </div>

            {product.applications && product.applications.length > 0 && (
              <div className="mt-7 border-t border-slate-200 pt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Common applications</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.applications.map((application) => (
                    <Link
                      className="text-sm font-bold text-brand-blue underline decoration-blue-200 underline-offset-4 transition hover:text-brand-navy"
                      href={`/applications/${application.slug}`}
                      key={application.documentId}
                    >
                      {application.name} ↗
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className="sticky top-[100px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl" aria-label="On this product page">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 sm:px-8">
          <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Jump to</span>
          <div className="flex min-w-max gap-6">
            {pageSections.map((section) => (
              <a
                className="border-b-2 border-transparent py-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
                href={section.href}
                key={section.href}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="scroll-mt-44 bg-white py-14 sm:py-20" id="overview">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <header>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">Product overview</p>
              <h2 className="mt-3 max-w-2xl text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.65rem]">About this product</h2>
            </div>
          </header>

          <div className="mt-9 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 shadow-[0_20px_55px_rgba(12,53,86,0.09)]">
            <div className={`grid gap-px ${features.length > 0 ? 'lg:grid-cols-[0.82fr_1.18fr]' : ''}`}>
              <article className="relative overflow-hidden bg-brand-navy p-6 text-white sm:p-8 lg:p-10">
                <div className="industrial-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
                <div className="relative">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-300">Product summary</p>
                  <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white">What it is designed for</h3>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-blue-100/80">{product.shortDescription}</p>
                  <Link className="mt-6 inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.09em] text-white underline decoration-white/30 underline-offset-4 hover:text-blue-100" href={`/products/category/${product.category.slug}`}>
                    Explore {product.category.name} <span className="ml-2" aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>

              {features.length > 0 && (
              <div className="bg-slate-200">
                <div className="flex items-center justify-between gap-4 bg-white px-5 py-5 sm:px-6 lg:px-7">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Buyer highlights</p>
                    <h3 className="mt-1 text-xl font-extrabold text-slate-950">Key features</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{features.length} capabilities</span>
                </div>
                <ul className="grid grid-cols-2 gap-px">
                  {features.map((feature, index) => (
                    <li className="bg-white p-4 sm:grid sm:grid-cols-[auto_1fr] sm:gap-3 sm:p-5" key={feature.id}>
                      <span className="grid size-8 place-items-center rounded-lg bg-blue-50 font-mono text-[10px] font-bold text-brand-blue">{String(index + 1).padStart(2, '0')}</span>
                      <div className="mt-3 sm:mt-0">
                        <h3 className="text-sm font-extrabold leading-snug text-slate-950 sm:text-base">{feature.title}</h3>
                        {feature.description && <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">{feature.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="bg-white px-5 py-4 text-xs leading-5 text-slate-500 sm:px-6">Final selection is confirmed against the application and operating conditions.</p>
              </div>
              )}
            </div>

            {(product.description?.length ?? 0) > 0 && (
              <details className="group bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 border-t border-slate-200 px-5 py-5 marker:hidden sm:px-7">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-500">Detailed information</p>
                    <p className="mt-1 text-sm font-extrabold text-slate-950">Read the complete product description</p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 text-lg font-bold text-brand-blue transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <div className="max-w-4xl border-t border-slate-100 px-5 py-7 sm:px-7 sm:py-8">
                  <BlocksRenderer content={product.description} />
                </div>
              </details>
            )}
          </div>
        </div>
      </section>

      {specifications.length > 0 && (
        <section className="scroll-mt-44 border-y border-slate-200 bg-brand-surface py-14 sm:py-20" id="specifications">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:gap-14">
            <div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">Technical data</p>
                <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.65rem]">Specifications</h2>
              </div>
              <p className="mt-5 text-[15px] leading-7 text-slate-600">Published values are grouped like a technical data sheet, so buyers can compare the product against their application requirements.</p>
              <div className="mt-7 border-t border-slate-300 pt-6">
                <p className="text-sm font-extrabold text-slate-950">Need a custom configuration?</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">Share the required size, colour, quantity or operating condition for confirmation.</p>
                <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-blue px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-brand-navy" href={quoteHref}>
                  Discuss requirement <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(12,53,86,0.09)]">
              <div className="flex items-center justify-between gap-4 bg-brand-navy px-5 py-5 text-white sm:px-6">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-blue-100/70">Technical data sheet</p>
                  <p className="mt-1 text-base font-extrabold text-white">{product.modelNumber ?? product.name}</p>
                </div>
                <span className="font-mono text-xs text-blue-100/70">{String(specifications.length).padStart(2, '0')} values</span>
              </div>

              {specificationGroups.map(([group, groupSpecifications]) => (
                <section className="grid border-t border-slate-200 first:border-t-0 sm:grid-cols-[9.5rem_1fr]" key={group}>
                  <h3 className="bg-blue-50 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.09em] text-brand-blue sm:px-6 sm:py-5">{group}</h3>
                  <dl className="divide-y divide-slate-200">
                    {groupSpecifications.map((specification) => (
                      <div className={`flex items-start justify-between gap-5 px-5 py-4 sm:px-6 ${specification.highlighted ? 'bg-orange-50/50' : ''}`} key={specification.id}>
                        <dt className="text-sm text-slate-600">{specification.label}</dt>
                        <dd className="text-right text-sm font-extrabold leading-6 text-slate-950">{specification.value}{specification.unit ? ` ${specification.unit}` : ''}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                <p className="text-xs leading-5 text-slate-500">Final dimensions and compatibility are confirmed during enquiry review.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {product.certifications && product.certifications.length > 0 && (
        <section className="scroll-mt-44 border-b border-slate-200 bg-white py-14 sm:py-20" id="certifications">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">Published records</p>
                <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.65rem]">Standards & compliance</h2>
              </div>
              <p className="max-w-xl text-[15px] leading-7 text-slate-600">Open the supporting record or verification source where it is available.</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {product.certifications.map((certification) => {
                const documentUrl = getMediaUrl(certification.document?.url)
                const verificationUrl = safeExternalUrl(certification.verificationUrl)

                return (
                  <article className="rounded-2xl border border-slate-200 bg-brand-surface p-5 sm:p-6" key={certification.documentId}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-navy text-sm font-black text-white" aria-hidden="true">✓</span>
                      {certification.standardCode && <span className="rounded-full bg-white px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">{certification.standardCode}</span>}
                    </div>
                    <h3 className="mt-4 text-base font-extrabold leading-tight text-slate-950">{certification.name}</h3>
                    {certification.issuingAuthority && <p className="mt-2 text-xs text-slate-600">Issued by {certification.issuingAuthority}</p>}
                    {(certification.validFrom || certification.validUntil) && <p className="mt-1 text-xs text-slate-600">Validity: {formatDate(certification.validFrom) ?? '—'} – {formatDate(certification.validUntil) ?? '—'}</p>}
                    {(documentUrl || verificationUrl) && (
                      <div className="mt-4 flex gap-4 border-t border-slate-200 pt-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">
                        {documentUrl && <a className="underline underline-offset-4" href={documentUrl} rel="noreferrer" target="_blank">Document ↗</a>}
                        {verificationUrl && <a className="underline underline-offset-4" href={verificationUrl} rel="noreferrer" target="_blank">Verify ↗</a>}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-blue-100/70">Need technical confirmation?</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl">Request fit, custom-option and pricing details.</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">{product.modelNumber ?? product.name} will already be selected in the enquiry.</p>
          </div>
          <Link className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-whatsapp-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp" href={quoteHref}>
            <WhatsAppIcon className="size-4" />
            Request quotation
          </Link>
        </div>
      </section>

      {product.relatedBlogPosts && product.relatedBlogPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">Related insights</p>
            <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.65rem]">Technical articles</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {product.relatedBlogPosts.map((post) => <BlogCard key={post.documentId} post={post} />)}
            </div>
          </div>
        </section>
      )}

      <div className="scroll-mt-44" id="faqs">
        <FaqList faqs={faqs} eyebrow="Product FAQ" title="Common questions" />
      </div>
    </main>
  )
}
