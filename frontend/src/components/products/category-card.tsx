import Image from 'next/image'
import Link from 'next/link'

import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { getMediaUrl } from '@/lib/strapi/client'
import type { ProductCategorySummary } from '@/lib/strapi/types'

export function CategoryCard({ category }: { category: ProductCategorySummary }) {
  const imageUrl = getMediaUrl(category.image?.url)

  return (
    <Link
      className="group relative min-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white transition duration-300 hover:-translate-y-1 hover:border-catalogue-accent hover:shadow-[0_24px_60px_rgba(98,93,145,0.18)]"
      href={`/products/category/${category.slug}`}
    >
      {imageUrl && category.image ? (
        <Image
          alt={category.image.alternativeText ?? category.name}
          className="object-cover opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-55"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={imageUrl}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f5b99,#052f5f_55%,#0a3a6b)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-end">
        {category.parentCategory && (
          <span className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">
            {cleanCatalogueLabel(category.parentCategory.name)}
          </span>
        )}
        <h3 className="text-2xl font-black tracking-tight">{cleanCatalogueLabel(category.name)}</h3>
        {category.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
            {category.description}
          </p>
        )}
        <span className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
          Explore category <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
