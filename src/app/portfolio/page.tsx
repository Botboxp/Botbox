'use client'

import { useEffect, useState } from 'react'
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
            {/* Header + Toggle */}
            <div className="videos-header reveal">
              <div>
                <div className="section-label" style={{ marginBottom: 14 }}>{t('portfolio.label')}</div>
                <h2 className="videos-title disp">{t('portfolio.title')}</h2>
              </div>
            </div>

            {/* Section toggle */}
            <div className="tabs-wrapper reveal" style={{ marginBottom: 24 }}>
              <div className="photo-tabs">
                <button
                  className={`photo-tab${section === 'video' ? ' active' : ''}`}
                  onClick={() => setSection('video')}
                >
                  {t('portfolio.video')}
                </button>
                <button
                  className={`photo-tab${section === 'photo' ? ' active' : ''}`}
                  onClick={() => setSection('photo')}
                >
                  {t('portfolio.photo')}
                </button>
              </div>
            </div>

            {/* ── VIDEO ── */}
            {section === 'video' && (
              <>
                <div className="tabs-wrapper reveal" style={{ marginBottom: 2 }}>
                  <div className="photo-tabs">
                    {VIDEO_TABS.map(tab => (
                      <button
                        key={tab.key}
                        className={`photo-tab${videoTab === tab.key ? ' active' : ''}`}
                        onClick={() => setVideoTab(tab.key)}
                      >
                        {t(tab.i18n)}
                      </button>
                    ))}
                  </div>
                </div>

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
              </>
            )}

            {/* ── PHOTO ── */}
            {section === 'photo' && (
              <>
                <div className="tabs-wrapper reveal">
                  <div className="photo-tabs">
                    {PHOTO_TABS.map(tab => (
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
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
