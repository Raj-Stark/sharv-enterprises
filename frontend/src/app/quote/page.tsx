import type { Metadata } from 'next'

import { QuotationForm } from '@/components/quotation/quotation-form'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getStrapiPublicUrl } from '@/lib/strapi/client'
import { getProducts } from '@/lib/strapi/queries'

type QuotePageProps = {
  searchParams: Promise<{
    product?: string | string[]
    destination?: string | string[]
  }>
}

export const metadata: Metadata = buildPageMetadata({
  title: 'WhatsApp Quotation',
  description:
    'Save a packaging requirement and continue the quotation conversation on WhatsApp.',
  pathname: '/quote',
})

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams
  const productSlug = Array.isArray(params.product) ? params.product[0] : params.product
  const rawDestination = Array.isArray(params.destination)
    ? params.destination[0]
    : params.destination
  const defaultDeliveryDestination = rawDestination?.trim().slice(0, 200)
  const products = await getProducts().catch(() => [])
  const selectedProduct = productSlug
    ? products.find((product) => product.slug === productSlug)
    : undefined
  return (
    <main className="min-h-screen bg-[#f3f6f8]">
      <section className="border-b border-slate-200 bg-white py-7 sm:py-9">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/55">WhatsApp quotation</p>
          <h1 className="mt-3 text-[2.15rem] font-black leading-[1.08] tracking-[-0.04em] text-black sm:text-[2.5rem]">Get a quote without the long form.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Share a few essentials. We save your reference and open a ready-to-send WhatsApp message.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <QuotationForm
            defaultDeliveryDestination={defaultDeliveryDestination}
            defaultProductDocumentId={selectedProduct?.documentId}
            endpoint={`${getStrapiPublicUrl()}/api/quotation-requests`}
            products={products}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>
      </section>
    </main>
  )
}
