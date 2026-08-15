'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'

export function FloatingWhatsAppButton() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)
  const isProductDetailPage = pathSegments[0] === 'products' && pathSegments.length === 2
  const isProductsCatalogue = pathname === '/products'
  const isBlogDetailPage = pathSegments[0] === 'blogs' && pathSegments.length === 2
  const isContactPage = pathname === '/contact'
  const isAboutPage = pathname === '/about'

  if (pathname === '/quote' || isProductDetailPage || isProductsCatalogue || isBlogDetailPage || isContactPage || isAboutPage) return null

  return (
    <Link
      aria-label="Start a WhatsApp quotation"
      className="group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full border-2 border-white bg-whatsapp text-white shadow-[0_14px_35px_rgba(37,211,102,0.38)] transition duration-200 hover:-translate-y-1 hover:bg-whatsapp-dark focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-whatsapp sm:bottom-6 sm:right-6 sm:size-15"
      href="/quote"
    >
      <WhatsAppIcon className="size-6" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.11em] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        WhatsApp quote
      </span>
    </Link>
  )
}
