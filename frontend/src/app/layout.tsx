import type { Metadata } from 'next'

import { FloatingWhatsAppButton } from '@/components/site/floating-whatsapp-button'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { getSiteSetting } from '@/lib/strapi/queries'

import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000',
  ),
  title: {
    default: 'Sharv Enterprises | Mechanical Sealing Partner',
    template: '%s | Sharv Enterprises',
  },
  description:
    'Explore mechanical sealing products for pumps and rotating equipment with domestic and export quotation support.',
  openGraph: {
    type: 'website',
    siteName: 'Sharv Enterprises',
    title: 'Sharv Enterprises | Mechanical Sealing Partner',
    description:
      'Mechanical sealing products with application-led discovery for domestic buyers and export enquiries.',
    images: [
      {
        url: '/og.jpg',
        width: 2100,
        height: 1395,
        alt: 'Mechanical pump seal components',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sharv Enterprises | Mechanical Sealing Partner',
    description:
      'Mechanical sealing products with application-led discovery for domestic buyers and export enquiries.',
    images: ['/og.jpg'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const setting = await getSiteSetting().catch(() => null)
  const companyName = setting?.companyName ?? 'Sharv Enterprises'

  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader companyName={companyName} />
        <div className="flex-1">{children}</div>
        <SiteFooter setting={setting} />
        <FloatingWhatsAppButton />
      </body>
    </html>
  )
}
