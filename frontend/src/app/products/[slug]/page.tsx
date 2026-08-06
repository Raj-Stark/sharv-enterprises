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
          <nav className="flex min-w-0 items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500" aria-label="Breadcrumb">
            <Link className="shrink-0 hover:text-black" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link className="shrink-0 hover:text-black" href="/products">Products</Link>
            <span aria-hidden="true">/</span>
            <Link className="hidden truncate hover:text-black sm:block" href={`/products/category/${product.category.slug}`}>
              {product.category.name}
            </Link>
            <span className="hidden sm:inline" aria-hidden="true">/</span>
            <span className="truncate text-black">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="border-b border-slate-200 bg-[#f3f6f8] py-8 sm:py-12 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:items-start lg:gap-14">
          <ProductGallery images={productImages} productName={product.name} featured={product.featured} />

          <div className="lg:py-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="rounded-full bg-black px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
                href={`/products/category/${product.category.slug}`}
              >
                {product.category.name}
              </Link>
              {product.modelNumber && (
                <span className="rounded-full border border-slate-300 bg-white px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.12em] text-black">
                  {product.modelNumber}
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.05em] text-black sm:text-5xl lg:text-[3.25rem]">
              {product.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {product.shortDescription}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <dt className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Model</dt>
                <dd className="mt-2 truncate text-sm font-black text-black">{product.modelNumber ?? 'On request'}</dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <dt className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">SKU</dt>
                <dd className="mt-2 truncate text-sm font-black text-black">{product.sku ?? 'On request'}</dd>
              </div>
            </dl>

            {quickSpecifications.length > 0 && (
              <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                {quickSpecifications.map((specification) => (
                  <div className="rounded-xl border border-slate-200 bg-white p-4" key={specification.id}>
                    <dt className="line-clamp-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">{specification.label}</dt>
                    <dd className="mt-2 line-clamp-2 text-sm font-black text-black">
                      {specification.value}{specification.unit ? ` ${specification.unit}` : ''}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <Link
              className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-whatsapp-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-whatsapp"
              href={quoteHref}
            >
              <WhatsAppIcon className="size-4" />
              Get WhatsApp quote
            </Link>
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
              Product reference is automatically added to the short quotation form.
            </p>

            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white text-center">
              {['Fit confirmation', 'India supply', 'Export enquiries'].map((item, index) => (
                <div className={`px-2 py-3 text-[9px] font-black uppercase tracking-[0.08em] text-black ${index > 0 ? 'border-l border-slate-200' : ''}`} key={item}>
                  {item}
                </div>
              ))}
            </div>

            {product.applications && product.applications.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Common applications</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.applications.map((application) => (
                    <Link
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-black transition hover:border-black"
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

      <nav className="border-b border-slate-200 bg-white" aria-label="On this product page">
        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-5 sm:px-8">
          <span className="hidden shrink-0 pr-6 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 md:block">Product information</span>
          <div className="flex min-w-max gap-1 py-2">
            {pageSections.map((section) => (
              <a
                className="rounded-lg px-4 py-3 text-[10px] font-black uppercase tracking-[0.11em] text-slate-600 transition hover:bg-slate-100 hover:text-black"
                href={section.href}
                key={section.href}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="scroll-mt-28 bg-white py-14 sm:py-20" id="overview">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
            <header>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Product overview</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">What this product is for.</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                Review the CMS-managed technical description before confirming the final fit and material selection.
              </p>
            </header>
            <article className="rounded-3xl border border-slate-200 bg-[#f8fafb] p-6 sm:p-9">
              <BlocksRenderer content={product.description} />
            </article>
          </div>

          {features.length > 0 && (
            <section className="mt-12 border-t border-slate-200 pt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">At a glance</p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-black">Key features</h2>
                </div>
                <p className="max-w-md text-xs leading-6 text-slate-500">Final selection remains subject to application and operating-condition review.</p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <article className={`rounded-2xl border p-5 ${feature.highlighted ? 'border-black bg-black text-white' : 'border-slate-200 bg-white text-black'}`} key={feature.id}>
                    <span className={`font-mono text-[10px] font-black ${feature.highlighted ? 'text-white/55' : 'text-slate-400'}`}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-4 text-base font-black leading-tight">{feature.title}</h3>
                    {feature.description && <p className={`mt-2 text-xs leading-6 ${feature.highlighted ? 'text-white/65' : 'text-slate-500'}`}>{feature.description}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {specifications.length > 0 && (
        <section className="scroll-mt-28 border-y border-slate-200 bg-[#f3f6f8] py-14 sm:py-20" id="specifications">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Technical data</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Specifications</h2>
              </div>
              <p className="max-w-lg text-xs leading-6 text-slate-500">Use these values as a starting point; dimensional compatibility is confirmed during enquiry review.</p>
            </div>
            <div className="mt-8 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
              {specificationGroups.map(([group, groupSpecifications]) => (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={group}>
                  <h3 className="bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white">{group}</h3>
                  <dl>
                    {groupSpecifications.map((specification, index) => (
                      <div className={`flex items-start justify-between gap-5 px-5 py-4 ${index > 0 ? 'border-t border-slate-200' : ''} ${specification.highlighted ? 'bg-[#edf3f6]' : ''}`} key={specification.id}>
                        <dt className="text-sm text-slate-500">{specification.label}</dt>
                        <dd className="text-right text-sm font-black text-black">{specification.value}{specification.unit ? ` ${specification.unit}` : ''}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.certifications && product.certifications.length > 0 && (
        <section className="scroll-mt-28 border-b border-slate-200 bg-white py-14 sm:py-20" id="certifications">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Published records</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Standards & compliance</h2>
              </div>
              <p className="max-w-xl text-xs leading-6 text-slate-500">Open the supporting record or verification source where it is available.</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {product.certifications.map((certification) => {
                const documentUrl = getMediaUrl(certification.document?.url)
                const verificationUrl = safeExternalUrl(certification.verificationUrl)

                return (
                  <article className="rounded-2xl border border-slate-200 bg-[#f8fafb] p-5" key={certification.documentId}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black text-sm font-black text-white" aria-hidden="true">✓</span>
                      {certification.standardCode && <span className="rounded-full bg-white px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-black">{certification.standardCode}</span>}
                    </div>
                    <h3 className="mt-4 text-base font-black leading-tight text-black">{certification.name}</h3>
                    {certification.issuingAuthority && <p className="mt-2 text-xs text-slate-500">Issued by {certification.issuingAuthority}</p>}
                    {(certification.validFrom || certification.validUntil) && <p className="mt-1 text-xs text-slate-500">Validity: {formatDate(certification.validFrom) ?? '—'} – {formatDate(certification.validUntil) ?? '—'}</p>}
                    {(documentUrl || verificationUrl) && (
                      <div className="mt-4 flex gap-4 border-t border-slate-200 pt-3 text-[10px] font-black uppercase tracking-[0.12em] text-black">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Need technical confirmation?</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white">Ask about {product.modelNumber ?? product.name} on WhatsApp.</h2>
            <p className="mt-3 text-sm text-white/65">The product reference will already be selected in the short quote form.</p>
          </div>
          <Link className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-whatsapp-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp" href={quoteHref}>
            <WhatsAppIcon className="size-4" />
            Get WhatsApp quote
          </Link>
        </div>
      </section>

      {product.relatedBlogPosts && product.relatedBlogPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Related insights</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-black">Technical articles</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {product.relatedBlogPosts.map((post) => <BlogCard key={post.documentId} post={post} />)}
            </div>
          </div>
        </section>
      )}

      <div id="faqs">
        <FaqList faqs={faqs} eyebrow="Product FAQ" title="Common questions" />
      </div>
    </main>
  )
}
