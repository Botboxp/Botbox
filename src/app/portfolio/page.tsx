'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/i18n/context'
import { useContent } from '@/hooks/useContent'
import { dispatchTyped, listenTyped } from '@/types/events'
import Navbar from '@/components/Navbar'
import VideoModal from '@/components/VideoModal'
import PhotoLightbox from '@/components/PhotoLightbox'
import CustomCursor from '@/components/CustomCursor'
import ScrollReveal from '@/components/ScrollReveal'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

/* ── Video ── */
interface Video {
  title: string
  youtube_id: string
}

type VideoData = Record<string, Video[]>

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
  const { data: videoData, error: videoError, retry: retryVideos } = useContent<VideoData>('/content/videos.json')
  const [videoTab, setVideoTab] = useState('commercial')

  /* ── Photo state ── */
  const { data: photoData, error: photoError, retry: retryPhotos } = useContent<PhotoData>('/content/photos.json')
  const [photoTab, setPhotoTab] = useState<PhotoCategory>('portraits')

  /* Handle hash on load */
  useEffect(() => {
    if (window.location.hash === '#photos') {
      setSection('photo')
      dispatchTyped('portfolioSectionChanged', 'photo')
    }
  }, [])

  /* Listen for nav section toggle */
  useEffect(() => {
    return listenTyped('portfolioSection', (detail) => setSection(detail))
  }, [])

  /* Notify nav of section changes */
  useEffect(() => {
    dispatchTyped('portfolioSectionChanged', section)
  }, [section])

  /* Show/hide back-to-top button */
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 1000)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tabsRef = useRef<HTMLDivElement>(null)

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* Reset tabs scroll to start when switching sections, auto-scroll active tab on tab click */
  useEffect(() => {
    if (tabsRef.current) tabsRef.current.scrollLeft = 0
  }, [section])

  useEffect(() => {
    const container = tabsRef.current
    if (!container) return
    const activeBtn = container.querySelector('.photo-tab.active') as HTMLElement
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [videoTab, photoTab])

  const filteredVideos = videoData ? (videoData[videoTab] || []) : []

  const photoImages: string[] = photoData
    ? photoData[photoTab].map(p => prefixPath(p.image))
    : []

  function handleVideoClick(youtubeId: string) {
    dispatchTyped('openVideo', youtubeId)
  }

  function handlePhotoClick(index: number) {
    dispatchTyped('openLightbox', { images: photoImages, index })
  }

  return (
    <>
      <Navbar />
      <CustomCursor />
      <ScrollReveal />
      <VideoModal />
      <PhotoLightbox />

      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <section id="portfolio" style={{ paddingTop: 20 }}>
          <div className="container">
            {/* Back button — desktop only */}
            <Link href="/" className="portfolio-back portfolio-back-desktop">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M11.5 6.5h-10M6.5 1.5l-5 5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{t('portfolio.back')}</span>
            </Link>

            {/* Header */}
            <h1 className="videos-title disp" style={{ marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
              {section === 'video' ? t('videos.title') : t('photos.title')}
            </h1>
          </div>

          {/* Sticky category tabs — full width, centered */}
          <div className="portfolio-sticky-bar">
            <div className="container">
              <div ref={tabsRef} className="photo-tabs portfolio-tabs" role="tablist" aria-label={section === 'video' ? 'Video categories' : 'Photo categories'}>
                {section === 'video'
                  ? VIDEO_TABS.map(tab => (
                      <button
                        key={tab.key}
                        role="tab"
                        aria-selected={videoTab === tab.key}
                        className={`photo-tab${videoTab === tab.key ? ' active' : ''}`}
                        onClick={() => setVideoTab(tab.key)}
                      >
                        {t(tab.i18n)}
                      </button>
                    ))
                  : PHOTO_TABS.map(tab => (
                      <button
                        key={tab.key}
                        role="tab"
                        aria-selected={photoTab === tab.key}
                        className={`photo-tab${photoTab === tab.key ? ' active' : ''}`}
                        onClick={() => setPhotoTab(tab.key)}
                      >
                        {t(tab.i18n)}
                      </button>
                    ))}
              </div>
            </div>
          </div>

          <div className="container" style={{ marginTop: 2 }}>
            {/* ── VIDEO ── */}
            {section === 'video' && (
              <div className="videos-grid" id="videosGrid">
                {!videoError && !videoData && Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton skeleton-card" />
                ))}
                {videoError && <div className="fetch-error"><p>{t('error.load')}</p><button className="retry-btn" onClick={retryVideos}>{t('error.retry')}</button></div>}
                {filteredVideos.map((video, i) => (
                  <div
                    key={`${video.youtube_id}-${i}`}
                    className="video-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleVideoClick(video.youtube_id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleVideoClick(video.youtube_id) } }}
                  >
                    <Image
                      className="video-thumb"
                      src={`https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="video-overlay" />
                    <div className="video-play-btn">
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                        <path d="M1 1l11 6.5L1 14V1z" fill="white" />
                      </svg>
                    </div>
                    <div className="video-tag">{videoTab}</div>
                    <div className="video-info">
                      <div className="video-info-title disp">{video.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── PHOTO ── */}
            {section === 'photo' && (
              <div className="photos-grid">
                {!photoError && !photoData && Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton skeleton-photo" />
                ))}
                {photoError && <div className="fetch-error"><p>{t('error.load')}</p><button className="retry-btn" onClick={retryPhotos}>{t('error.retry')}</button></div>}
                {photoImages.map((src, i) => (
                  <div
                    key={`${photoTab}-${i}`}
                    className="photo-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePhotoClick(i)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePhotoClick(i) } }}
                  >
                    <Image className="photo-img" src={src} alt={`${photoTab} photo ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" />
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

        <CTA />
        <Footer />
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
