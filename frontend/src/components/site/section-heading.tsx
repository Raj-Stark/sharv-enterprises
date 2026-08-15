type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.65rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[1.02rem] leading-7 text-slate-600">{description}</p>
      )}
    </div>
  )
}
