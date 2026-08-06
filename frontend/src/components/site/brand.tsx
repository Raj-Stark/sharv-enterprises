import Image from 'next/image'
import Link from 'next/link'

type BrandProps = {
  companyName?: string
  compact?: boolean
  tone?: 'default' | 'inverse'
}

export function Brand({
  companyName = 'Sharv Enterprises',
  compact = false,
  tone = 'default',
}: BrandProps) {
  return (
    <Link
      className="group inline-flex shrink-0 items-center"
      href="/"
      aria-label={`${companyName} home`}
    >
      <Image
        alt={`${companyName} logo`}
        className={`h-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5 ${compact ? 'w-28' : 'w-40 sm:w-52'} ${tone === 'inverse' ? 'brightness-0 invert opacity-95' : ''}`}
        height={600}
        loading="eager"
        src="/brand/sharv-enterprises-logo-transparent.png"
        width={1800}
      />
    </Link>
  )
}
