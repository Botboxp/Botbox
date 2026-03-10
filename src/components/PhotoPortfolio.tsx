'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

const TABS: { key: Category; i18n: string }[] = [
  { key: 'portraits', i18n: 'tab.portraits' },
  { key: 'events', i18n: 'tab.events' },
  { key: 'products', i18n: 'tab.products' },
  { key: 'athletes', i18n: 'tab.athletes' },
  { key: 'nature', i18n: 'tab.nature' },
]

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

const LIMIT = 6

export default function PhotoPortfolio() {
  const { t } = useI18n()
  const [data, setData] = useState<PhotoData | null>(null)
  const [activeTab, setActiveTab] = useState<Category>('portraits')

  useEffect(() => {
    fetch('/content/photos.json')
      .then(r => r.json())
      .then((d: PhotoData) => setData(d))
      .catch(console.error)
  }, [])

  if (!data) return null

  const images: string[] = data[activeTab].map(p => prefixPath(p.image))
  const visible = images.slice(0, LIMIT)

  function handlePhotoClick(index: number) {
    window.dispatchEvent(
      new CustomEvent('openLightbox', { detail: { images: visible, index } })
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
                onClick={() => setActiveTab(tab.key)}
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

        <Link href="/portfolio#photos" className="view-more-btn">
          {t('btn.viewall')}
        </Link>
      </div>
    </section>
  )
}
