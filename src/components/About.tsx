'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useI18n } from '@/i18n/context'

interface GalleryItem {
  image: string
  alt?: string
}

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export default function About() {
  const { t } = useI18n()
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    fetch('/content/about.json')
      .then(r => r.json())
      .then(data => setGallery(data.gallery))
      .catch(console.error)
  }, [])

  return (
    <section id="about">
      <div className="container">
        <div className="about-inner">
          <div className="reveal">
            <div className="section-label" style={{ marginBottom: 14 }}>{t('about.label')}</div>
            <h2 className="disp" style={{ fontSize: 'clamp(40px,5vw,62px)', letterSpacing: '0.04em' }}>
              {t('about.title')}
            </h2>
            <p className="about-text-sub">{t('about.p1')}</p>
            <p className="about-text-sub">{t('about.p2')}</p>
            <div className="about-highlight">
              <p>{t('about.emmy')}</p>
            </div>
            <div className="about-actions">
              <a href="#cta" className="btn">
                <span>{t('about.cta')}</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="about-socials">
                <a href="https://www.instagram.com/botboxp/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m-.25 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9m10.16 1.13a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" /></svg>
                </a>
                <a href="https://www.facebook.com/botboxp/?checkpoint_src=any" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                  <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" /></svg>
                </a>
                <a href="https://youtube.com/@botboxproduction5632?si=a-tymoCWaScnibaw" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="YouTube">
                  <svg viewBox="0 0 24 24"><path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 0 0 2.42 7.19 26.4 26.4 0 0 0 2 12a26.4 26.4 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77A26.4 26.4 0 0 0 22 12a26.4 26.4 0 0 0-.42-4.81M10 15V9l5.2 3L10 15" /></svg>
                </a>
                <a href="https://www.linkedin.com/company/botbox-productions/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="about-gallery reveal reveal-delay-2">
            {gallery.map((g, i) => (
              <Image
                key={i}
                className="about-gallery-img"
                src={prefixPath(g.image)}
                alt={g.alt || 'Behind the scenes'}
                width={400}
                height={300}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
