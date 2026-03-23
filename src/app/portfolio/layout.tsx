import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio — Botbox Production',
  description: 'Explore our video and photography portfolio. Commercials, music videos, documentaries, events, portraits and more.',
  alternates: {
    canonical: 'https://www.botboxp.com/portfolio',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}
