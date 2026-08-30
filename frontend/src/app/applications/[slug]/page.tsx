import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlocksRenderer } from '@/components/content/blocks-renderer'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { ProductGrid } from '@/components/products/product-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { EmptyState } from '@/components/site/empty-state'
import { FaqList } from '@/components/site/faq-list'
import { getMediaUrl } from '@/lib/strapi/client'
import { getApplicationBySlug, getProductsByApplication } from '@/lib/strapi/queries'
import { buildPageMetadata, buildSeoMetadata } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/seo/site-url'

type ApplicationPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ApplicationPageProps): Promise<Metadata> {
  const { slug } = await params
  const application = await getApplicationBySlug(slug)

  if (!application) {
    return buildPageMetadata({
      title: 'Application not found',
      description: 'The requested Sharv Enterprises packaging application could not be found.',
      pathname: `/applications/${slug}`,
      noIndex: true,
    })
  }

  return buildSeoMetadata({
    seo: application.seo,
    fallbackTitle: `${application.name} Packaging Products`,
    fallbackDescription: application.summary,
    fallbackImage: application.image,
    pathname: `/applications/${application.slug}`,
  })
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { slug } = await params
  const [application, products] = await Promise.all([
    getApplicationBySlug(slug),
    getProductsByApplication(slug),
  ])

  if (!application) notFound()

  const imageUrl = getMediaUrl(application.image?.url)

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: application.name,
          description: application.summary,
          url: getSiteUrl(`/applications/${application.slug}`),
        }}
      />
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {imageUrl && application.image && (
          <Image
            alt={application.image.alternativeText ?? application.name}
            className="object-cover opacity-35"
            fill
            priority
            sizes="100vw"
            src={imageUrl}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
          <nav className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500" aria-label="Breadcrumb">
            <Link className="hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <Link className="hover:text-white" href="/applications">Applications</Link>
            <span className="px-2">/</span>
            <span className="text-orange-400">{application.name}</span>
          </nav>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-orange-400">Application</p>
          <h1 className="mt-3 max-w-4xl text-[2.15rem] font-black leading-[1.08] tracking-[-0.04em] sm:text-[2.7rem] lg:text-5xl">{application.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{application.summary}</p>
        </div>
      </section>

      {application.content && application.content.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <BlocksRenderer content={application.content} />
          </div>
        </section>
      )}

      <section className="border-t border-slate-200 bg-brand-surface py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Connected catalogue</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Products for {application.name}</h2>
            </div>
            <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-black hover:underline" href="/quote">
              <WhatsAppIcon className="size-4 text-whatsapp" />
              Enquire on WhatsApp →
            </Link>
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              actionHref="/quote"
              actionLabel="Share operating details"
              description="No published product is connected to this application yet. Send the duty details for a direct review."
              title="Product mapping is being prepared"
            />
          )}
        </div>
      </section>

      <FaqList faqs={application.faqs} eyebrow="Application FAQ" title={`${application.name} questions`} />
    </main>
  )
}
