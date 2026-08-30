import type { Metadata } from 'next'

import { FloatingWhatsAppButton } from '@/components/site/floating-whatsapp-button'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { OFFICIAL_EMAIL } from '@/lib/business/contact'
import { getDefaultSocialImage } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/seo/site-url'
import { getSiteSetting } from '@/lib/strapi/queries'

import './globals.css'

export const dynamic = 'force-dynamic'

const defaultSocialImage = getDefaultSocialImage()

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000',
  ),
  title: {
    default: 'Sharv Enterprises | Industrial Packaging Supplies',
    template: '%s | Sharv Enterprises',
  },
  description:
    'Explore packaging tapes, stretch films, protective packaging, boxes and security seals with domestic and export quotation support.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'Sharv Enterprises',
    locale: 'en_IN',
    url: getSiteUrl('/'),
    title: 'Sharv Enterprises | Industrial Packaging Supplies',
    description:
      'Industrial packaging materials and security seals with product-led discovery for domestic buyers and export enquiries.',
    images: [defaultSocialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sharv Enterprises | Industrial Packaging Supplies',
    description:
      'Industrial packaging materials and security seals with product-led discovery for domestic buyers and export enquiries.',
    images: [defaultSocialImage],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const setting = await getSiteSetting().catch(() => null)
  const companyName = setting?.companyName ?? 'Sharv Enterprises'
  const enquiryEmail = setting?.enquiryEmail?.trim() || OFFICIAL_EMAIL

  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader companyName={companyName} enquiryEmail={enquiryEmail} />
        <div className="flex-1">{children}</div>
        <SiteFooter setting={setting} />
        <FloatingWhatsAppButton />
      </body>
    </html>
  )
}
