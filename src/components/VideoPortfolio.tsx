'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'

interface Video {
  title: string
  youtube_id: string
  category: string
}

const TABS = [
  { key: 'all', i18n: 'tab.all' },
  { key: 'commercial', i18n: 'tab.commercial' },
  { key: 'music-video', i18n: 'tab.musicvideo' },
  { key: 'documentary', i18n: 'tab.documentary' },
  { key: 'promo', i18n: 'tab.promo' },
  { key: 'short-film', i18n: 'tab.shortfilm' },
  { key: 'real-estate', i18n: 'tab.realestate' },
  { key: 'event', i18n: 'tab.event' },
]

function getLimit(): number {
  if (typeof window === 'undefined') return 6
  return window.innerWidth <= 768 ? 4 : 6
}

export default function VideoPortfolio() {
  const { t } = useI18n()
  const [videos, setVideos] = useState<Video[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [limit, setLimit] = useState(6)

  useEffect(() => { setLimit(getLimit()) }, [])

  useEffect(() => {
    fetch('/content/videos.json')
      .then(r => r.json())
      .then(data => setVideos(data.items))
      .catch(console.error)
  }, [])

  const filtered = activeCategory === 'all'
    ? videos
    : videos.filter(v => v.category === activeCategory)

  const visible = showAll ? filtered : filtered.slice(0, limit)

  function handleTabClick(key: string) {
    setActiveCategory(key)
    setShowAll(false)
  }

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
          <div className="photo-tabs">
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
          {visible.map((video, i) => (
            <div
              key={`${video.youtube_id}-${i}`}
              className="video-card"
              data-videoid={video.youtube_id}
              data-vcategory={video.category}
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

        {filtered.length > limit && (
          <button
            className="view-more-btn"
            onClick={() => setShowAll(prev => !prev)}
          >
            {showAll ? t('btn.showless') : t('btn.viewmore')}
          </button>
        )}
      </div>
    </section>
  )
}
