import Image from 'next/image'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { getMediaUrl } from '@/lib/strapi/client'
import type { ProductSummary } from '@/lib/strapi/types'

export function ProductCard({
  product,
  headingLevel = 2,
}: {
  product: ProductSummary
  headingLevel?: 2 | 3
}) {
  const imageUrl = getMediaUrl(product.coverImage?.url)
  const productReference = product.modelNumber || product.sku
  const Heading = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-catalogue-accent hover:shadow-[0_24px_60px_rgba(98,93,145,0.16)]">
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/3] overflow-hidden border-b border-slate-100 bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
        href={`/products/${product.slug}`}
      >
        {imageUrl ? (
          <Image
            alt={product.coverImage.alternativeText ?? product.name}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={imageUrl}
          />
        ) : (
          <span className="grid h-full place-items-center text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Product image
          </span>
        )}
        {product.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
            Featured
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.14em]">
          <Link
            className="truncate text-black underline decoration-slate-300 underline-offset-4 hover:decoration-catalogue-accent"
            href={`/products/category/${product.category.slug}`}
          >
            {product.category.name}
          </Link>
          {productReference && <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-black">{productReference}</span>}
        </div>
        <Heading className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-[1.35rem]">
          <Link className="hover:underline hover:decoration-catalogue-accent hover:decoration-2 hover:underline-offset-4" href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.shortDescription}
        </p>
        <div className="mt-auto pt-5">
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-3 text-[10px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-catalogue-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-catalogue-accent"
              href={`/products/${product.slug}`}
            >
              View details
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-whatsapp px-3 text-[10px] font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-whatsapp-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
              href={`/quote?product=${product.slug}`}
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              Get quote
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
