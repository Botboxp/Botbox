'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'

interface Service {
  title: string
  description: string
  number: string
  label: string
  background: string
}

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export default function Services() {
  const { t } = useI18n()
  const [services, setServices] = useState<Service[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/content/services.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => setServices(data.items))
      .catch(() => setError(true))
  }, [])

  return (
    <section id="services">
      <div className="container">
        <div className="services-header reveal">
          <div>
            <div className="section-label" style={{ marginBottom: 14 }}>{t('services.label')}</div>
            <h2 className="services-title disp">{t('services.title')}</h2>
          </div>
          <a href="#cta" className="btn">
            <span>{t('nav.quote')}</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div className="services-grid">
          {!error && services.length === 0 && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '3/4', minHeight: 300 }} />
          ))}
          {error && <p className="fetch-error">{t('error.load')}</p>}
          {services.map((s, i) => {
            const idx = i + 1
            const title = t(`svc.${idx}.title`)
            const desc = t(`svc.${idx}.desc`)
            const label = t(`svc.${idx}.label`)
            const descItems = desc.split(', ')

            return (
              <a href="#cta" className="service-card reveal" key={i}>
                <div
                  className="service-card-img"
                  style={{ backgroundImage: `url('${prefixPath(s.background)}')` }}
                />
                <div className="service-card-overlay" />
                <div className="service-card-arrow">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="service-card-content">
                  <div className="service-card-number">{s.number} / {label}</div>
                  <h3 className="service-card-title disp">{title}</h3>
                  <ul className="service-card-list">
                    {descItems.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
