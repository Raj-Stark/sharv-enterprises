'use client'

import { useDeferredValue, useMemo, useState } from 'react'

import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import type { ProductSummary } from '@/lib/strapi/types'

import { ProductCard } from './product-card'

export function ProductCatalogue({ products }: { products: ProductSummary[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase()
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return products

    return products.filter((product) =>
      [
        product.name,
        product.shortDescription,
        product.modelNumber,
        product.sku,
        cleanCatalogueLabel(product.category.name),
      ]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)),
    )
  }, [normalizedQuery, products])

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <label className="relative block min-w-0 flex-1" htmlFor="catalogue-search">
          <span className="sr-only">Search products, models or SKUs</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-slate-400" aria-hidden="true">
            <svg className="size-4" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
              <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </span>
          <input
            className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-3 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden"
            id="catalogue-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, model or SKU"
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear product search"
              className="absolute inset-y-0 right-3 my-auto grid size-8 place-items-center rounded-full text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
              onClick={() => setQuery('')}
              type="button"
            >
              ×
            </button>
          )}
        </label>
        <p className="shrink-0 px-1 text-xs font-bold text-slate-500" aria-live="polite">
          <span className="text-slate-950">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard headingLevel={3} key={product.documentId} product={product} variant="catalogue" />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-lg font-extrabold text-slate-950">No matching product found</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Try a product family, model reference or a shorter search term.
          </p>
          <button className="mt-5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-blue underline underline-offset-4" onClick={() => setQuery('')} type="button">
            Clear search
          </button>
        </div>
      )}
    </>
  )
}
