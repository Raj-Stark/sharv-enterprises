import type { Metadata } from 'next'

import { QuotationForm } from '@/components/quotation/quotation-form'
import { getStrapiPublicUrl } from '@/lib/strapi/client'
import { getProducts } from '@/lib/strapi/queries'

type QuotePageProps = {
  searchParams: Promise<{
    product?: string | string[]
    type?: string | string[]
    destination?: string | string[]
  }>
}

export const metadata: Metadata = {
  title: 'WhatsApp Quotation',
  description:
    'Save a domestic or export packaging requirement and continue the quotation conversation on WhatsApp.',
  alternates: { canonical: '/quote' },
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams
  const productSlug = Array.isArray(params.product) ? params.product[0] : params.product
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type
  const rawDestination = Array.isArray(params.destination)
    ? params.destination[0]
    : params.destination
  const defaultEnquiryType = rawType === 'export' ? 'export' : 'domestic'
  const defaultDeliveryDestination = rawDestination?.trim().slice(0, 200)
  const products = await getProducts().catch(() => [])
  const selectedProduct = productSlug
    ? products.find((product) => product.slug === productSlug)
    : undefined
  return (
    <main className="min-h-screen bg-[#f3f6f8]">
      <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/55">WhatsApp quotation</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-black sm:text-5xl">Get a quote without the long form.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Share a few essentials. We save your reference and open a ready-to-send WhatsApp message.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <QuotationForm
            defaultDeliveryDestination={defaultDeliveryDestination}
            defaultEnquiryType={defaultEnquiryType}
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
