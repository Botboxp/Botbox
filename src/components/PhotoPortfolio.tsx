'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const LIMIT = 8

export default function PhotoPortfolio() {
  const { t } = useI18n()
  const [data, setData] = useState<PhotoData | null>(null)
  const [activeTab, setActiveTab] = useState<Category>('portraits')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleTabClick = (key: Category) => {
    setActiveTab(key)
    requestAnimationFrame(() => {
      const active = tabsRef.current?.querySelector('.photo-tab.active') as HTMLElement
      active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    })
  }

  useEffect(() => {
    fetch('/content/photos.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then((d: PhotoData) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const images: string[] = data ? data[activeTab].map(p => prefixPath(p.image)) : []
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
          <div ref={tabsRef} className="photo-tabs">
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
          {loading && Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="skeleton skeleton-photo" />
          ))}
          {error && <p className="fetch-error">{t('error.load')}</p>}
          {visible.map((src, i) => (
            <div
              key={`${activeTab}-${i}`}
              className="photo-card"
              role="button"
              tabIndex={0}
              onClick={() => handlePhotoClick(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePhotoClick(i) } }}
            >
              <Image className="photo-img" src={src} alt={`${activeTab} photo ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" />
              <div className="photo-overlay" />
              <div className="photo-expand">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1h4M1 1v4M11 1h-4M11 1v4M1 11h4M1 11v-4M11 11h-4M11 11v-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/portfolio#photos" className="btn">
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
