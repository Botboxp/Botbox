'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'

interface Settings {
  hero_video: string
  hero_showreel_id: string
}

export default function Hero() {
  const { t } = useI18n()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/content/settings.json')
      .then(r => r.json())
      .then(data => setSettings(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const START = 4
    const END_MARGIN = 4
    video.currentTime = START
    const handleTime = () => {
      if (video.duration && video.currentTime >= video.duration - END_MARGIN) {
        video.currentTime = START
      }
    }
    video.addEventListener('timeupdate', handleTime)
    return () => video.removeEventListener('timeupdate', handleTime)
  }, [settings])

  const extractYouTubeId = (input: string) => {
    const match = input.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : input
  }

  const openReel = (e: React.MouseEvent) => {
    e.preventDefault()
    const id = extractYouTubeId(settings?.hero_showreel_id || 'lfIq4rXrXF4')
    window.dispatchEvent(new CustomEvent('openVideo', { detail: id }))
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (href?.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero">
      <div className="hero-bg">
        {!videoFailed ? (
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            playsInline
            poster="/assets/img/logos/botbox-logo.png"
            onError={() => setVideoFailed(true)}
          >
            <source src={settings?.hero_video || '/assets/video/Botbox DemoReel.mp4'} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-video-fallback" style={{ backgroundImage: "url('/assets/img/logos/botbox-logo.png')" }} />
        )}
        <div className="hero-overlay" />
      </div>

      <div className="hero-grid" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Miami, Florida &middot; Est. 2009
        </div>

        <h1 className="hero-title">
          <img
            src="/assets/img/botbox-logo.svg"
            alt="Botbox Production"
            className="hero-logo"
          />
        </h1>

        <p className="hero-subtitle">{t('hero.subtitle')}</p>

        <div className="hero-actions">
          <a href="#" className="hero-reel-btn" onClick={openReel}>
            <span className="play-icon">
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                <path d="M1 1l11 6.5L1 14V1z" fill="#222" />
              </svg>
            </span>
            <span>{t('hero.showreel')}</span>
          </a>

          <Link href="/portfolio" className="btn">
            <span>{t('hero.portfolio')}</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>{t('hero.scroll')}</span>
      </div>
    </section>
  )
}
