'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import Navbar from '@/components/Navbar'
import VideoModal from '@/components/VideoModal'
import PhotoLightbox from '@/components/PhotoLightbox'
import CustomCursor from '@/components/CustomCursor'
import ScrollReveal from '@/components/ScrollReveal'

/* ── Video ── */
interface Video {
  title: string
  youtube_id: string
  category: string
}

const VIDEO_TABS = [
  { key: 'commercial', i18n: 'tab.commercial' },
  { key: 'music-video', i18n: 'tab.musicvideo' },
  { key: 'documentary', i18n: 'tab.documentary' },
  { key: 'promo', i18n: 'tab.promo' },
  { key: 'short-film', i18n: 'tab.shortfilm' },
  { key: 'real-estate', i18n: 'tab.realestate' },
  { key: 'event', i18n: 'tab.event' },
]

/* ── Photo ── */
interface Photo { image: string }
interface PhotoData {
  portraits: Photo[]
  events: Photo[]
  products: Photo[]
  athletes: Photo[]
  nature: Photo[]
}

const PHOTO_CATEGORIES = ['portraits', 'events', 'products', 'athletes', 'nature'] as const
type PhotoCategory = (typeof PHOTO_CATEGORIES)[number]

const PHOTO_TABS: { key: PhotoCategory; i18n: string }[] = [
  { key: 'portraits', i18n: 'tab.portraits' },
  { key: 'events', i18n: 'tab.events' },
  { key: 'products', i18n: 'tab.products' },
  { key: 'athletes', i18n: 'tab.athletes' },
  { key: 'nature', i18n: 'tab.nature' },
]

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

type Section = 'video' | 'photo'

export default function PortfolioPage() {
  const { t } = useI18n()
  const [section, setSection] = useState<Section>('video')
  const [showTop, setShowTop] = useState(false)

  /* ── Video state ── */
  const [videos, setVideos] = useState<Video[]>([])
  const [videoTab, setVideoTab] = useState('commercial')

  /* ── Photo state ── */
  const [photoData, setPhotoData] = useState<PhotoData | null>(null)
  const [photoTab, setPhotoTab] = useState<PhotoCategory>('portraits')

  useEffect(() => {
    fetch('/content/videos.json')
      .then(r => r.json())
      .then(data => setVideos(data.items))
      .catch(console.error)

    fetch('/content/photos.json')
      .then(r => r.json())
      .then((d: PhotoData) => setPhotoData(d))
      .catch(console.error)
  }, [])

  /* Handle hash on load */
  useEffect(() => {
    if (window.location.hash === '#photos') setSection('photo')
  }, [])

  /* Listen for nav section toggle */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Section>).detail
      setSection(detail)
    }
    window.addEventListener('portfolioSection', handler)
    return () => window.removeEventListener('portfolioSection', handler)
  }, [])

  /* Show/hide back-to-top button */
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const filteredVideos = videos.filter(v => v.category === videoTab)

  const photoImages: string[] = photoData
    ? photoData[photoTab].map(p => prefixPath(p.image))
    : []

  function handleVideoClick(youtubeId: string) {
    window.dispatchEvent(new CustomEvent('openVideo', { detail: youtubeId }))
  }

  function handlePhotoClick(index: number) {
    window.dispatchEvent(new CustomEvent('openLightbox', { detail: { images: photoImages, index } }))
  }

  return (
    <>
      <Navbar />
      <CustomCursor />
      <ScrollReveal />
      <VideoModal />
      <PhotoLightbox />

      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <section id="portfolio">
          <div className="container">
            {/* Back button */}
            <Link href="/" className="portfolio-back reveal">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M11.5 6.5h-10M6.5 1.5l-5 5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{t('portfolio.back')}</span>
            </Link>

            {/* Header */}
            <div className="videos-header reveal" style={{ marginTop: 8 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 14 }}>{t('portfolio.label')}</div>
                <h2 className="videos-title disp">{t('portfolio.title')}</h2>
              </div>
            </div>

            {/* Sticky category tabs */}
            <div className="portfolio-sticky-bar">
              <div className="photo-tabs">
                {section === 'video'
                  ? VIDEO_TABS.map(tab => (
                      <button
                        key={tab.key}
                        className={`photo-tab${videoTab === tab.key ? ' active' : ''}`}
                        onClick={() => setVideoTab(tab.key)}
                      >
                        {t(tab.i18n)}
                      </button>
                    ))
                  : PHOTO_TABS.map(tab => (
                      <button
                        key={tab.key}
                        className={`photo-tab${photoTab === tab.key ? ' active' : ''}`}
                        onClick={() => setPhotoTab(tab.key)}
                      >
                        {t(tab.i18n)}
                      </button>
                    ))}
              </div>
            </div>

            {/* ── VIDEO ── */}
            {section === 'video' && (
              <div className="videos-grid reveal" id="videosGrid">
                {filteredVideos.map((video, i) => (
                  <div
                    key={`${video.youtube_id}-${i}`}
                    className="video-card"
                    onClick={() => handleVideoClick(video.youtube_id)}
                  >
                    <div
                      className="video-thumb"
                      style={{ backgroundImage: `url('https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg')` }}
                    />
                    <div className="video-overlay" />
                    <div className="video-play-btn">
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                        <path d="M1 1l11 6.5L1 14V1z" fill="white" />
                      </svg>
                    </div>
                    <div className="video-tag">{video.category}</div>
                    <div className="video-info">
                      <div className="video-info-title disp">{video.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── PHOTO ── */}
            {section === 'photo' && (
              <div className="photos-grid reveal">
                {photoImages.map((src, i) => (
                  <div
                    key={`${photoTab}-${i}`}
                    className="photo-card"
                    onClick={() => handlePhotoClick(i)}
                  >
                    <div className="photo-img" style={{ backgroundImage: `url('${src}')` }} />
                    <div className="photo-overlay" />
                    <div className="photo-expand">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1h4M1 1v4M11 1h-4M11 1v4M1 11h4M1 11v-4M11 11h-4M11 11v-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Back to top button */}
      <button
        className={`back-to-top${showTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 12V2M2 6l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  )
}
