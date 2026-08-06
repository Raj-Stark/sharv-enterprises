import type { Metadata } from 'next'

import { QuotationForm } from '@/components/quotation/quotation-form'
import { getStrapiPublicUrl } from '@/lib/strapi/client'
import { getProducts, getSiteSetting } from '@/lib/strapi/queries'

type QuotePageProps = {
  searchParams: Promise<{
    product?: string | string[]
    type?: string | string[]
  }>
}

export const metadata: Metadata = {
  title: 'WhatsApp Quotation',
  description:
    'Save a domestic or export mechanical-seal requirement and continue the quotation conversation on WhatsApp.',
  alternates: { canonical: '/quote' },
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams
  const productSlug = Array.isArray(params.product) ? params.product[0] : params.product
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type
  const defaultEnquiryType = rawType === 'export' ? 'export' : 'domestic'
  const [products, setting] = await Promise.all([getProducts(), getSiteSetting()])
  const selectedProduct = productSlug
    ? products.find((product) => product.slug === productSlug)
    : undefined
  const whatsappDigits = setting?.whatsappNumber?.replace(/\D/g, '') ?? ''
  const whatsappConfigured = whatsappDigits.length >= 8 && whatsappDigits.length <= 15

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
          {whatsappConfigured ? (
            <QuotationForm
              defaultEnquiryType={defaultEnquiryType}
              defaultProductDocumentId={selectedProduct?.documentId}
              endpoint={`${getStrapiPublicUrl()}/api/quotation-requests`}
              products={products}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black">Temporarily unavailable</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">The WhatsApp quotation number is not configured yet.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Please try again after the published Site Setting has a valid international WhatsApp number. No fake or fallback recipient will be used.</p>
              {(setting?.enquiryEmail || setting?.phone) && (
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
                  {setting.enquiryEmail && <a className="text-black underline underline-offset-4" href={`mailto:${setting.enquiryEmail}`}>{setting.enquiryEmail}</a>}
                  {setting.phone && <a className="text-black underline underline-offset-4" href={`tel:${setting.phone}`}>{setting.phone}</a>}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
