import { ResilientImage as Image } from '@/components/media/resilient-image'
import Link from 'next/link'

import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { getPublicMediaUrl } from '@/lib/strapi/media'
import type { ProductCategorySummary, ProductSummary } from '@/lib/strapi/types'

const familyDescriptions: Record<string, string> = {
  'Adhesive Tape': 'Carton sealing, printed branding and dependable everyday closure.',
  'Container Security': 'Tamper-evident seals for containers, trailers and controlled access.',
  'Packaging Materials': 'Essential materials for shipping, storage and routine handling.',
  'Protective Packaging': 'Cushioning and surface protection for safer product movement.',
  Strapping: 'Secure bundling and load restraint for demanding transport conditions.',
  'Stretch Film': 'Hand and machine films for stable, protected pallet loads.',
}

export function ProductFamilyCard({
  category,
  products,
  position,
}: {
  category: ProductCategorySummary
  products: ProductSummary[]
  position: number
}) {
  const cleanName = cleanCatalogueLabel(category.name)
  const representativeProduct = products[0]
  const imageUrl = getPublicMediaUrl(
    category.image?.url ?? representativeProduct?.coverImage?.url,
  )
  const description =
    category.description?.trim() ||
    familyDescriptions[cleanName] ||
    `Browse ${cleanName.toLocaleLowerCase()} options for your packaging requirement.`

  return (
    <Link
      aria-label={`Browse ${cleanName}, ${products.length} ${products.length === 1 ? 'product' : 'products'}`}
      className="group grid min-h-44 grid-cols-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(12,53,86,0.05)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_22px_50px_rgba(12,53,86,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue sm:block"
      href={`/products?category=${encodeURIComponent(category.slug)}`}
    >
      <div className="relative min-h-full overflow-hidden bg-slate-100 sm:aspect-[16/9] sm:min-h-0">
        {imageUrl ? (
          <Image
            alt={category.image?.alternativeText ?? representativeProduct?.name ?? cleanName}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 50vw, 33vw"
            src={imageUrl}
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#eaf3f9,#cadfec)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/35 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.09em] text-brand-navy shadow-sm backdrop-blur-sm">
          Family {String(position).padStart(2, '0')}
        </span>
      </div>

      <div className="flex min-w-0 flex-col p-4 sm:min-h-52 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
            {cleanName}
          </h3>
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-brand-blue">
            {products.length} {products.length === 1 ? 'option' : 'options'}
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
          {description}
        </p>

        <span className="mt-auto inline-flex items-center pt-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-blue transition group-hover:text-brand-navy">
          View this family
          <span className="ml-2 grid size-7 place-items-center rounded-full bg-blue-50 transition group-hover:translate-x-1 group-hover:bg-blue-100" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
