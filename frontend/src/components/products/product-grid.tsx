import type { ProductSummary } from '@/lib/strapi/types'

import { ProductCard } from './product-card'

export function ProductGrid({
  products,
  headingLevel = 2,
}: {
  products: ProductSummary[]
  headingLevel?: 2 | 3
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard headingLevel={headingLevel} key={product.documentId} product={product} />
      ))}
    </div>
  )
}
