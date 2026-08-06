import type { FaqComponent } from '@/lib/strapi/types'

export function FaqList({
  faqs,
  eyebrow = 'FAQ',
  title = 'Common questions',
}: {
  faqs?: FaqComponent[] | null
  eyebrow?: string
  title?: string
}) {
  const sortedFaqs = [...(faqs ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  )

  if (sortedFaqs.length === 0) return null

  return (
    <section className="border-t border-slate-200 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {sortedFaqs.map((faq) => (
            <details className="group py-5" key={faq.id}>
              <summary className="cursor-pointer list-none pr-8 font-bold text-slate-950 marker:hidden">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
