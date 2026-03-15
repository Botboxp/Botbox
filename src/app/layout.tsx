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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
