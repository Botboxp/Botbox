'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'
import Navbar from '@/components/Navbar'
import VideoModal from '@/components/VideoModal'
import PhotoLightbox from '@/components/PhotoLightbox'
import CustomCursor from '@/components/CustomCursor'
import ScrollReveal from '@/components/ScrollReveal'

/* ── Video types & tabs ── */
interface Video {
  title: string
  youtube_id: string
  category: string
}

const VIDEO_TABS = [
  { key: 'all', i18n: 'tab.all' },
  { key: 'commercial', i18n: 'tab.commercial' },
  { key: 'music-video', i18n: 'tab.musicvideo' },
  { key: 'documentary', i18n: 'tab.documentary' },
  { key: 'promo', i18n: 'tab.promo' },
  { key: 'short-film', i18n: 'tab.shortfilm' },
  { key: 'real-estate', i18n: 'tab.realestate' },
  { key: 'event', i18n: 'tab.event' },
]

/* ── Photo types & tabs ── */
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

const PHOTO_TABS: { key: 'all' | PhotoCategory; i18n: string }[] = [
  { key: 'all', i18n: 'tab.all' },
  { key: 'portraits', i18n: 'tab.portraits' },
  { key: 'events', i18n: 'tab.events' },
  { key: 'products', i18n: 'tab.products' },
  { key: 'athletes', i18n: 'tab.athletes' },
  { key: 'nature', i18n: 'tab.nature' },
]

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function interleave(data: PhotoData): string[] {
  const arrays = PHOTO_CATEGORIES.map(cat => data[cat].map(p => prefixPath(p.image)))
  const result: string[] = []
  const maxLen = Math.max(...arrays.map(a => a.length))
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) result.push(arr[i])
    }
  }
  return result
}

export default function PortfolioPage() {
  const { t } = useI18n()

  /* ── Video state ── */
  const [videos, setVideos] = useState<Video[]>([])
  const [videoTab, setVideoTab] = useState('all')

  /* ── Photo state ── */
  const [photoData, setPhotoData] = useState<PhotoData | null>(null)
  const [photoTab, setPhotoTab] = useState<'all' | PhotoCategory>('all')

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

  const filteredVideos = videoTab === 'all'
    ? videos
    : videos.filter(v => v.category === videoTab)

  const photoImages: string[] = photoData
    ? photoTab === 'all'
      ? interleave(photoData)
      : photoData[photoTab].map(p => prefixPath(p.image))
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
        {/* ── VIDEO PORTFOLIO ── */}
        <section id="videos">
          <div className="container">
            <div className="videos-header reveal">
              <div>
                <div className="section-label" style={{ marginBottom: 14 }}>{t('videos.label')}</div>
                <h2 className="videos-title disp">{t('videos.title')}</h2>
              </div>
            </div>

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
          </div>
        </section>

        {/* ── PHOTO PORTFOLIO ── */}
        <section id="photos">
          <div className="container">
            <div className="photos-header reveal">
              <div>
                <div className="section-label" style={{ marginBottom: 14 }}>{t('photos.label')}</div>
                <h2 className="photos-title disp">{t('photos.title')}</h2>
              </div>
            </div>

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
          </div>
        </section>
      </main>
    </>
  )
}
