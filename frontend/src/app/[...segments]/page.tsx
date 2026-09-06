import type { Metadata } from 'next'
import { ResilientImage as Image } from '@/components/media/resilient-image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlocksRenderer } from '@/components/content/blocks-renderer'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { ProductGrid } from '@/components/products/product-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { EmptyState } from '@/components/site/empty-state'
import { FaqList } from '@/components/site/faq-list'
import { getMediaUrl } from '@/lib/strapi/client'
import { getSeoLandingByPath } from '@/lib/strapi/queries'
import { buildSeoMetadata } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/seo/site-url'

type LandingPageProps = {
  params: Promise<{ segments: string[] }>
}

function landingPath(segments: string[]): string {
  return `/${segments.join('/')}`
}

function audienceLabel(audience: 'domestic' | 'export' | 'both'): string {
  if (audience === 'domestic') return 'India supply'
  if (audience === 'export') return 'Export enquiries'
  return 'Domestic & export'
}

function safeExternalUrl(value?: string | null): string | null {
  if (!value || !/^https:\/\//i.test(value)) return null
  return value
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { segments } = await params
  const path = landingPath(segments)
  const landing = await getSeoLandingByPath(path)

  if (!landing) notFound()

  return buildSeoMetadata({
    seo: landing.seo,
    fallbackTitle: landing.h1,
    fallbackDescription: landing.summary,
    fallbackImage: landing.heroImage,
    pathname: landing.path,
  })
}

export default async function SeoLandingPage({ params }: LandingPageProps) {
  const { segments } = await params
  const path = landingPath(segments)
  const landing = await getSeoLandingByPath(path)

  if (!landing) notFound()

  const imageUrl = getMediaUrl(landing.heroImage?.url)
  const verificationUrl = safeExternalUrl(landing.certification?.verificationUrl)
  const certificateDocumentUrl = getMediaUrl(landing.certification?.document?.url)
  const breadcrumbSegments = landing.path.split('/').filter(Boolean)

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: landing.h1,
          description: landing.summary,
          url: getSiteUrl(landing.path),
        }}
      />
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {imageUrl && landing.heroImage && (
          <Image
            alt={landing.heroImage.alternativeText ?? landing.h1}
            className="object-cover opacity-35"
            fill
            priority
            sizes="100vw"
            src={imageUrl}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/35" />
        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
          <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500" aria-label="Breadcrumb">
            <Link className="hover:text-white" href="/">Home</Link>
            {breadcrumbSegments.map((segment, index) => {
              const isLast = index === breadcrumbSegments.length - 1
              const href = `/${breadcrumbSegments.slice(0, index + 1).join('/')}`
              const label = isLast && landing.breadcrumbLabel
                ? landing.breadcrumbLabel
                : segment.replace(/-/g, ' ')

              return (
                <span className="contents" key={href}>
                  <span>/</span>
                  <span className={isLast ? 'text-orange-400' : 'capitalize'}>{label}</span>
                </span>
              )
            })}
          </nav>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="bg-orange-500 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white">{landing.pageType.replace(/_/g, ' ')}</span>
            <span className="border border-slate-600 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">{audienceLabel(landing.audience)}</span>
          </div>
          <h1 className="mt-4 max-w-5xl text-[2.15rem] font-black leading-[1.08] tracking-[-0.04em] sm:text-[2.7rem] lg:text-5xl">{landing.h1}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{landing.summary}</p>
        </div>
      </section>

      {(landing.category || landing.application) && (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-5 sm:px-8">
            <span className="mr-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Related discovery</span>
            {landing.category && <Link className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-950" href={`/products/category/${landing.category.slug}`}>{landing.category.name}</Link>}
            {landing.application && <Link className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-950" href={`/applications/${landing.application.slug}`}>{landing.application.name}</Link>}
          </div>
        </section>
      )}

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_19rem]">
          <BlocksRenderer content={landing.content} />
          <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
            <div className="border-t-4 border-orange-500 bg-slate-950 p-6 text-white">
              <p className="text-[9px] font-black uppercase tracking-[0.17em] text-orange-400">Need product guidance?</p>
              <h2 className="mt-3 text-xl font-black">Send the product reference and your requirement.</h2>
              <Link className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-whatsapp px-5 text-xs font-black uppercase tracking-[0.12em] text-white hover:bg-whatsapp-dark" href="/quote">
                <WhatsAppIcon className="size-4" />
                Enquire on WhatsApp
              </Link>
            </div>
            {landing.certification && (
              <div className="border border-slate-200 p-6">
                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">Referenced record</p>
                <h2 className="mt-3 font-black text-slate-950">{landing.certification.name}</h2>
                {landing.certification.standardCode && <p className="mt-1 text-xs font-bold text-orange-600">{landing.certification.standardCode}</p>}
                {landing.certification.description && <p className="mt-3 text-xs leading-6 text-slate-600">{landing.certification.description}</p>}
                {(verificationUrl || certificateDocumentUrl) && (
                  <div className="mt-4 flex flex-col gap-2 text-xs font-bold text-orange-600">
                    {verificationUrl && <a href={verificationUrl} rel="noreferrer" target="_blank">Verify record ↗</a>}
                    {certificateDocumentUrl && <a href={certificateDocumentUrl} rel="noreferrer" target="_blank">View document ↗</a>}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-brand-surface py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Curated catalogue</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Relevant products</h2>
          <div className="mt-8">
            {landing.products && landing.products.length > 0 ? (
              <ProductGrid products={landing.products} />
            ) : (
              <EmptyState
                actionHref="/quote"
                actionLabel="Send your requirement"
                description="No published product is attached to this landing page yet. A direct application review is still available."
                title="Product selection is being prepared"
              />
            )}
          </div>
        </div>
      </section>

      <FaqList faqs={landing.faqs} eyebrow="Page FAQ" title="Common questions" />
    </main>
  )
}
