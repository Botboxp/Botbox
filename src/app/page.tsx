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

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <ClientTicker />
      <About />
      <Services />
      <VideoPortfolio />
      <PhotoPortfolio />
      <Process />
      <Stats />
      <ClientsWall />
      <Testimonials />
      <CTA />
      <Footer />
      <VideoModal />
      <PhotoLightbox />
      <ScrollReveal />
    </>
  )
}
