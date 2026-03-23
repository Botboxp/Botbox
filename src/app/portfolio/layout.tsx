import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio — Botbox Production',
  description: 'Explore Botbox Production\'s portfolio: commercials, music videos, documentaries, photography, events, and more. Miami-based audiovisual studio.',
  alternates: {
    canonical: 'https://www.botboxp.com/portfolio',
  },
  openGraph: {
    title: 'Portfolio — Botbox Production',
    description: 'Explore our video and photography portfolio. Commercials, music videos, documentaries, events, portraits and more.',
    url: 'https://www.botboxp.com/portfolio',
    images: ['/assets/img/logos/botbox-logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.botboxp.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Portfolio',
      item: 'https://www.botboxp.com/portfolio',
    },
  ],
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
