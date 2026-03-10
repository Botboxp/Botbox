'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'

interface Video {
  title: string
  youtube_id: string
  category: string
}

const TABS = [
  { key: 'commercial', i18n: 'tab.commercial' },
  { key: 'music-video', i18n: 'tab.musicvideo' },
  { key: 'documentary', i18n: 'tab.documentary' },
  { key: 'promo', i18n: 'tab.promo' },
  { key: 'short-film', i18n: 'tab.shortfilm' },
  { key: 'real-estate', i18n: 'tab.realestate' },
  { key: 'event', i18n: 'tab.event' },
]

const LIMIT = 6

export default function VideoPortfolio() {
  const { t } = useI18n()
  const [videos, setVideos] = useState<Video[]>([])
  const [activeCategory, setActiveCategory] = useState('commercial')
  const [error, setError] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleTabClick = (key: string) => {
    setActiveCategory(key)
    requestAnimationFrame(() => {
      const active = tabsRef.current?.querySelector('.photo-tab.active') as HTMLElement
      active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    })
  }

  useEffect(() => {
    fetch('/content/videos.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => setVideos(data.items))
      .catch(() => setError(true))
  }, [])

  const filtered = videos.filter(v => v.category === activeCategory)
  const visible = filtered.slice(0, LIMIT)

  function handleVideoClick(youtubeId: string) {
    window.dispatchEvent(new CustomEvent('openVideo', { detail: youtubeId }))
  }

  return (
    <section id="videos">
      <div className="container">
        <div className="videos-header reveal">
          <div>
            <div className="section-label" style={{ marginBottom: 14 }}>{t('videos.label')}</div>
            <h2 className="videos-title disp">{t('videos.title')}</h2>
          </div>
        </div>

        <div className="tabs-wrapper reveal" style={{ marginBottom: 2 }}>
          <div ref={tabsRef} className="photo-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`photo-tab${activeCategory === tab.key ? ' active' : ''}`}
                onClick={() => handleTabClick(tab.key)}
              >
                {t(tab.i18n)}
              </button>
            ))}
          </div>
        </div>

        <div className="videos-grid reveal" id="videosGrid">
          {!error && videos.length === 0 && Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
          {error && <p className="fetch-error">{t('error.load')}</p>}
          {visible.map((video, i) => (
            <div
              key={`${video.youtube_id}-${i}`}
              className="video-card"
              role="button"
              tabIndex={0}
              onClick={() => handleVideoClick(video.youtube_id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleVideoClick(video.youtube_id) } }}
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

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/portfolio" className="btn">
            <span>{t('btn.viewall')}</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
