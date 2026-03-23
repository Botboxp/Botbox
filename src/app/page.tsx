'use client'

import ErrorBoundary from '@/components/ErrorBoundary'
import { useContent } from '@/hooks/useContent'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ClientTicker from '@/components/ClientTicker'
import About from '@/components/About'
import Services from '@/components/Services'
import VideoPortfolio from '@/components/VideoPortfolio'
import PhotoPortfolio from '@/components/PhotoPortfolio'
import Process from '@/components/Process'
import Stats from '@/components/Stats'
import ClientsWall from '@/components/ClientsWall'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import VideoModal from '@/components/VideoModal'
import PhotoLightbox from '@/components/PhotoLightbox'
import CustomCursor from '@/components/CustomCursor'
import ScrollReveal from '@/components/ScrollReveal'

interface Settings {
  show_testimonials: boolean
}

export default function Home() {
  const { data: settings } = useContent<Settings>('/content/settings.json')
  const showTestimonials = settings?.show_testimonials ?? false

  return (
    <>
      <CustomCursor />
      <Navbar />
      <ErrorBoundary><Hero /></ErrorBoundary>
      <ErrorBoundary><ClientTicker /></ErrorBoundary>
      <ErrorBoundary><About /></ErrorBoundary>
      <ErrorBoundary><Services /></ErrorBoundary>
      <ErrorBoundary><VideoPortfolio /></ErrorBoundary>
      <ErrorBoundary><PhotoPortfolio /></ErrorBoundary>
      <ErrorBoundary><Process /></ErrorBoundary>
      <ErrorBoundary><Stats /></ErrorBoundary>
      <ErrorBoundary><ClientsWall /></ErrorBoundary>
      {showTestimonials && <ErrorBoundary><Testimonials /></ErrorBoundary>}
      <ErrorBoundary><CTA /></ErrorBoundary>
      <Footer />
      <VideoModal />
      <PhotoLightbox />
      <ScrollReveal />
    </>
  )
}
