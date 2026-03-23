'use client'

import Image from 'next/image'
import { useI18n } from '@/i18n/context'
import { useContent } from '@/hooks/useContent'

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

interface ServicesData {
  items: Service[]
}

export default function Services() {
  const { t } = useI18n()
  const { data, error, retry } = useContent<ServicesData>('/content/services.json')
  const services = data?.items ?? []

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
          {error && <div className="fetch-error"><p>{t('error.load')}</p><button className="retry-btn" onClick={retry}>{t('error.retry')}</button></div>}
          {services.map((s, i) => {
            const idx = i + 1
            const title = t(`svc.${idx}.title`)
            const desc = t(`svc.${idx}.desc`)
            const label = t(`svc.${idx}.label`)
            const descItems = desc.split(', ')

            return (
              <a href="#cta" className="service-card reveal" key={i}>
                <Image
                  className="service-card-img"
                  src={prefixPath(s.background)}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  loading="lazy"
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
