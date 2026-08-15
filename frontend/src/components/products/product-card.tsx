import Image from 'next/image'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { getPublicMediaUrl } from '@/lib/strapi/media'
import type { ProductSummary } from '@/lib/strapi/types'

export function ProductCard({
  product,
  headingLevel = 2,
  variant = 'standard',
}: {
  product: ProductSummary
  headingLevel?: 2 | 3
  variant?: 'standard' | 'catalogue'
}) {
  const imageUrl = getPublicMediaUrl(product.coverImage?.url)
  const productReference = product.modelNumber || product.sku
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const isCatalogue = variant === 'catalogue'

  return (
    <article className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-catalogue-accent hover:shadow-[0_24px_60px_rgba(25,84,124,0.14)] ${isCatalogue ? 'grid min-h-[11.75rem] grid-cols-[8.5rem_minmax(0,1fr)] sm:flex sm:h-full sm:flex-col' : 'flex h-full flex-col'}`}>
      <Link
        aria-label={`View ${product.name}`}
        className={`relative block overflow-hidden bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black ${isCatalogue ? 'min-h-full border-r border-slate-100 sm:min-h-0 sm:aspect-[4/3] sm:border-b sm:border-r-0' : 'aspect-[4/3] border-b border-slate-100'}`}
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
          <span className={`absolute rounded-full bg-brand-navy font-extrabold uppercase text-white shadow-sm ${isCatalogue ? 'left-2.5 top-2.5 px-2 py-1 text-[8px] tracking-[0.06em] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.08em]' : 'left-4 top-4 px-3 py-1.5 text-[10px] tracking-[0.08em]'}`}>
            Featured
          </span>
        )}
      </Link>
      <div className={`flex min-w-0 flex-1 flex-col ${isCatalogue ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}`}>
        <div className="flex items-center justify-between gap-3 text-[10px] font-extrabold uppercase tracking-[0.08em]">
          <Link
            className="truncate text-brand-blue transition hover:text-brand-navy"
            href={`/products/category/${product.category.slug}`}
          >
            {cleanCatalogueLabel(product.category.name)}
          </Link>
          {productReference && <span className={`shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ${isCatalogue ? 'hidden sm:inline' : ''}`}>{productReference}</span>}
        </div>
        <Heading className={`line-clamp-2 font-extrabold leading-snug tracking-[-0.015em] text-slate-950 ${isCatalogue ? 'mt-2 text-[1.05rem] sm:mt-3 sm:text-[1.3rem]' : 'mt-3 text-xl sm:text-[1.35rem]'}`}>
          <Link className="hover:underline hover:decoration-catalogue-accent hover:decoration-2 hover:underline-offset-4" href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </Heading>
        <p className={`mt-3 line-clamp-2 text-[15px] leading-6 text-slate-600 ${isCatalogue ? 'hidden sm:block' : ''}`}>
          {product.shortDescription}
        </p>
        <div className={`mt-auto ${isCatalogue ? 'pt-3 sm:pt-5' : 'pt-5'}`}>
          <div className={`border-t border-slate-100 pt-3 sm:pt-4 ${isCatalogue ? 'flex flex-col items-start gap-2 sm:grid sm:grid-cols-2' : 'grid grid-cols-2 gap-2'}`}>
            <Link
              className={`inline-flex items-center justify-center font-extrabold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${isCatalogue ? 'min-h-8 text-[9px] tracking-[0.07em] text-brand-blue hover:text-brand-navy sm:min-h-11 sm:rounded-lg sm:bg-brand-blue sm:px-3 sm:text-[10px] sm:text-white sm:hover:bg-brand-navy' : 'min-h-11 rounded-lg bg-brand-blue px-3 text-[10px] tracking-[0.07em] text-white hover:bg-brand-navy'}`}
              href={`/products/${product.slug}`}
            >
              View product <span className="ml-1.5" aria-hidden="true">→</span>
            </Link>
            <Link
              className={`inline-flex items-center justify-center gap-2 font-extrabold uppercase text-slate-900 transition-colors hover:bg-whatsapp-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp ${isCatalogue ? 'min-h-8 text-[9px] tracking-[0.05em] sm:min-h-11 sm:rounded-lg sm:border sm:border-whatsapp sm:px-3 sm:text-[10px] sm:tracking-[0.07em]' : 'min-h-11 rounded-lg border border-whatsapp px-3 text-[10px] tracking-[0.07em]'}`}
              href={`/quote?product=${product.slug}`}
            >
              <WhatsAppIcon className="size-3.5 text-whatsapp sm:size-4" />
              WhatsApp quote
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
