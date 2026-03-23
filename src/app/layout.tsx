import type { Metadata } from 'next'
import { I18nProvider } from '@/i18n/context'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.botboxp.com'),
  title: 'Botbox Production — Miami Audiovisual',
  description: 'Botbox Production is an award-winning audiovisual production studio in Miami, FL. Specializing in commercials, music videos, corporate events, photography and more.',
  openGraph: {
    title: 'Botbox Production — Miami Audiovisual Studio',
    description: 'Award-winning film production and post-production creative studio specializing in digital media advertising.',
    images: ['/assets/img/logos/botbox-logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/assets/img/logos/favicon.svg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.botboxp.com',
  name: 'Botbox Production',
  description: 'Award-winning audiovisual production studio in Miami, FL. Specializing in commercials, music videos, corporate events, photography and more.',
  url: 'https://www.botboxp.com',
  logo: 'https://www.botboxp.com/assets/img/logos/botbox-logo.png',
  image: 'https://www.botboxp.com/assets/img/logos/botbox-logo.png',
  telephone: ['+1-305-546-4487', '+1-305-776-9016'],
  email: 'info@botboxp.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Miami',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.instagram.com/botboxp/',
    'https://www.facebook.com/botboxp/',
    'https://youtube.com/@botboxproduction5632',
    'https://www.linkedin.com/company/botbox-productions/',
  ],
  priceRange: '$$',
  foundingDate: '2009',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
