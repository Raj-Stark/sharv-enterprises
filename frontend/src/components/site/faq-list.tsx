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
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.65rem]">
          {title}
        </h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-300">
          {sortedFaqs.map((faq) => (
            <details className="group py-5" key={faq.id}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-slate-950 marker:hidden">
                <span>{faq.question}</span>
                <span className="shrink-0 text-xl font-bold text-brand-blue transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-3xl pr-8 text-[15px] leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
