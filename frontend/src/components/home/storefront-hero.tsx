import Image from 'next/image'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { getMediaUrl } from '@/lib/strapi/client'
import type { ProductSummary } from '@/lib/strapi/types'

type StorefrontHeroProps = {
  eyebrow: string
  title: string
  description: string
  imageUrl: string | null
  imageAlt: string
  products: ProductSummary[]
}

function cleanCategoryName(value: string): string {
  return value
    .trim()
    .replace(/sequrity/gi, 'Security')
    .replace(/meterials/gi, 'Materials')
}

export function StorefrontHero({
  eyebrow,
  title,
  description,
  imageUrl,
  imageAlt,
  products,
}: StorefrontHeroProps) {
  const featuredProducts = products.slice(0, 3)

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f5f8fb]">
      <div className="pointer-events-none absolute -left-40 top-8 size-[30rem] rounded-full bg-blue-100/75 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-0 size-96 rounded-full bg-orange-100/65 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(25,84,124,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(25,84,124,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-11 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-white/90 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-blue shadow-sm backdrop-blur">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
            </span>
            {eyebrow}
          </div>

          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-slate-950 sm:text-[3.5rem] lg:text-[4rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-[1.05rem] leading-8 text-slate-700 sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-13 items-center justify-center rounded-xl bg-brand-blue px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(25,84,124,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-navy focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue"
              href="/products"
            >
              Explore products <span className="ml-3" aria-hidden="true">→</span>
            </Link>
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-slate-950 transition hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue"
              href="/quote"
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              Get a quotation
            </Link>
          </div>

          <ul className="mt-9 grid gap-3 border-t border-slate-200 pt-6 text-[0.95rem] font-semibold text-slate-700 sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-xs text-brand-blue" aria-hidden="true">✓</span>
              India &amp; export supply
            </li>
            <li className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-xs text-brand-blue" aria-hidden="true">✓</span>
              Product-linked quotes
            </li>
            <li className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-xs text-brand-blue" aria-hidden="true">✓</span>
              Selection support
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 -top-5 z-20 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_14px_35px_rgba(15,23,42,0.14)] sm:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.11em] text-orange-600">Built for business</p>
            <p className="mt-1 text-sm font-extrabold text-slate-950">Pack · Protect · Dispatch</p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-brand-navy p-3 shadow-[0_32px_85px_rgba(12,53,86,0.25)] sm:p-4">
            <div className="industrial-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
            <div className="relative grid grid-cols-[1.3fr_0.7fr] gap-2.5 sm:gap-3">
              <Link
                aria-label={featuredProducts[0] ? `View ${featuredProducts[0].name}` : 'Browse packaging products'}
                className="group relative row-span-2 min-h-[21rem] overflow-hidden rounded-[1.4rem] bg-white sm:min-h-[26rem]"
                href={featuredProducts[0] ? `/products/${featuredProducts[0].slug}` : '/products'}
              >
                {imageUrl ? (
                  <Image
                    alt={imageAlt}
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    fill
                    priority
                    sizes="(max-width: 1024px) 68vw, 31vw"
                    src={imageUrl}
                  />
                ) : (
                  <div className="industrial-grid absolute inset-0 bg-brand-navy opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/75">
                    {featuredProducts[0]
                      ? cleanCategoryName(featuredProducts[0].category.name)
                      : 'Featured range'}
                  </p>
                  <p className="mt-1 text-lg font-extrabold leading-snug sm:text-xl">
                    {featuredProducts[0]?.name ?? 'Industrial packaging range'}
                  </p>
                  <span className="mt-3 inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.08em]">
                    View product <span className="ml-2 transition group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>

              {featuredProducts.slice(1, 3).map((product, index) => {
                const productImageUrl = getMediaUrl(product.coverImage?.url)

                return (
                  <Link
                    aria-label={`View ${product.name}`}
                    className="group relative min-h-40 overflow-hidden rounded-[1.2rem] bg-white sm:min-h-[12.5rem]"
                    href={`/products/${product.slug}`}
                    key={product.documentId}
                  >
                    {productImageUrl ? (
                      <Image
                        alt={product.coverImage?.alternativeText ?? product.name}
                        className="object-cover transition duration-700 group-hover:scale-105"
                        fill
                        sizes="(max-width: 1024px) 32vw, 15vw"
                        src={productImageUrl}
                      />
                    ) : (
                      <div className="industrial-grid absolute inset-0 bg-brand-navy opacity-60" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                      <span className="font-mono text-[9px] font-bold text-white/70">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                      <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-snug sm:text-sm">{product.name}</p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-white">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/65">Live catalogue</p>
                <p className="mt-1 text-[13px] font-semibold leading-5">Compare products. Keep context in your quote.</p>
              </div>
              <Link className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-100 hover:text-white" href="/products">
                View all <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
