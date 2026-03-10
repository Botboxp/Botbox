'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'

interface Photo { image: string }
interface PhotoData {
  portraits: Photo[]
  events: Photo[]
  products: Photo[]
  athletes: Photo[]
  nature: Photo[]
}

const CATEGORIES = ['portraits', 'events', 'products', 'athletes', 'nature'] as const
type Category = (typeof CATEGORIES)[number]

const TABS: { key: 'all' | Category; i18n: string }[] = [
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

function getLimit(): number {
  if (typeof window === 'undefined') return 8
  return window.innerWidth <= 768 ? 6 : 8
}

function interleave(data: PhotoData): string[] {
  const arrays = CATEGORIES.map(cat => data[cat].map(p => prefixPath(p.image)))
  const result: string[] = []
  const maxLen = Math.max(...arrays.map(a => a.length))
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) result.push(arr[i])
    }
  }
  return result
}

export default function PhotoPortfolio() {
  const { t } = useI18n()
  const [data, setData] = useState<PhotoData | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | Category>('all')
  const [showAll, setShowAll] = useState(false)
  const [limit, setLimit] = useState(8)

  useEffect(() => { setLimit(getLimit()) }, [])

  useEffect(() => {
    fetch('/content/photos.json')
      .then(r => r.json())
      .then((d: PhotoData) => setData(d))
      .catch(console.error)
  }, [])

  if (!data) return null

  const images: string[] =
    activeTab === 'all'
      ? interleave(data)
      : data[activeTab].map(p => prefixPath(p.image))

  const visible = showAll ? images : images.slice(0, limit)

  function handleTabClick(key: 'all' | Category) {
    setActiveTab(key)
    setShowAll(false)
  }

  function handlePhotoClick(index: number) {
    window.dispatchEvent(
      new CustomEvent('openLightbox', { detail: { images, index } })
    )
  }

  return (
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
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`photo-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => handleTabClick(tab.key)}
              >
                {t(tab.i18n)}
              </button>
            ))}
          </div>
        </div>

        <div className="photos-grid reveal">
          {visible.map((src, i) => (
            <div
              key={`${activeTab}-${i}`}
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

        {images.length > limit && (
          <button
            className="view-more-btn"
            id="photosViewMore"
            onClick={() => setShowAll(prev => !prev)}
          >
            {showAll ? t('btn.showless') : t('btn.viewmore')}
          </button>
        )}
      </div>
    </section>
  )
}
