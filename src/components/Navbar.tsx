'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'

const NAV_LINKS = [
  { href: '#about', key: 'nav.about' },
  { href: '#services', key: 'nav.services' },
  { href: '#videos', key: 'nav.video' },
  { href: '#photos', key: 'nav.photography' },
  { href: '#process', key: 'nav.process' },
  { href: '#clients-wall', key: 'nav.clients' },
]

/* Map sections to which nav link should light up.
   process & stats → #process, testimonials & clients-wall → #clients-wall */
const SECTION_TO_NAV: Record<string, string> = {
  about: '#about',
  services: '#services',
  videos: '#videos',
  photos: '#photos',
  process: '#process',
  stats: '#process',
  'clients-wall': '#clients-wall',
  testimonials: '#clients-wall',
}

const OBSERVED_SECTIONS = Object.keys(SECTION_TO_NAV)

const SOCIALS = [
  { href: 'https://www.instagram.com/botboxp/', label: 'Instagram', icon: <svg viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m-.25 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9m10.16 1.13a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6"/></svg> },
  { href: 'https://www.facebook.com/botboxp/?checkpoint_src=any', label: 'Facebook', icon: <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/></svg> },
  { href: 'https://youtube.com/@botboxproduction5632?si=a-tymoCWaScnibaw', label: 'YouTube', icon: <svg viewBox="0 0 24 24"><path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 0 0 2.42 7.19 26.4 26.4 0 0 0 2 12a26.4 26.4 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77A26.4 26.4 0 0 0 22 12a26.4 26.4 0 0 0-.42-4.81M10 15V9l5.2 3L10 15"/></svg> },
  { href: 'https://www.linkedin.com/company/botbox-productions/', label: 'LinkedIn', icon: <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77"/></svg> },
]

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Navbar() {
  const { lang, t, toggleLang } = useI18n()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isPortfolio = pathname === '/portfolio'
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [activeSection, setActiveSection] = useState<'video' | 'photo'>('video')
  const [activeNav, setActiveNav] = useState<string>('')
  const manualClickRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Scroll spy for landing page ── */
  useEffect(() => {
    if (!isHome) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualClickRef.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const navHref = SECTION_TO_NAV[id]
            if (navHref) setActiveNav(navHref)
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    const timer = setTimeout(() => {
      OBSERVED_SECTIONS.forEach(id => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [isHome])

  // Listen for portfolio section changes
  useEffect(() => {
    const handler = (e: Event) => {
      setActiveSection((e as CustomEvent).detail)
    }
    window.addEventListener('portfolioSectionChanged', handler)
    return () => window.removeEventListener('portfolioSectionChanged', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (href?.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        // Temporarily disable scroll spy to prevent flickering
        manualClickRef.current = true
        setActiveNav(href)
        el.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => { manualClickRef.current = false }, 1000)
      }
      setIsOpen(false)
    }
  }, [])

  /* Portfolio nav: dispatch event to toggle section */
  const handlePortfolioNav = useCallback((section: 'video' | 'photo') => {
    window.dispatchEvent(new CustomEvent('portfolioSection', { detail: section }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(false)
  }, [])

  const logoLink = isHome ? '#hero' : '/'

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href={logoLink} className="nav-logo" onClick={isHome ? handleNavClick : undefined}>
            {!logoError ? (
              <img
                src="/assets/img/logos/botbox-logo.png"
                alt="Botbox Production"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="nav-logo-fallback">
                BOTBOX<span style={{ color: 'var(--grey)' }}>P</span>
              </span>
            )}
          </a>

          {/* Landing nav links */}
          {!isPortfolio && (
            <ul className="nav-links">
              {NAV_LINKS.map(link => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className={activeNav === link.href ? 'nav-active' : ''}
                    onClick={handleNavClick}
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Portfolio nav links */}
          {isPortfolio && (
            <ul className="nav-links">
              <li>
                <a
                  href="#"
                  className={activeSection === 'video' ? 'nav-active' : ''}
                  onClick={(e) => { e.preventDefault(); handlePortfolioNav('video') }}
                >
                  {t('portfolio.video')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeSection === 'photo' ? 'nav-active' : ''}
                  onClick={(e) => { e.preventDefault(); handlePortfolioNav('photo') }}
                >
                  {t('portfolio.photo')}
                </a>
              </li>
            </ul>
          )}

          <div className="nav-cta">
            {!isPortfolio && (
              <div className="nav-socials">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            )}

            <button className="lang-toggle" onClick={toggleLang} aria-label="Change language">
              <span className={lang === 'en' ? 'lang-active' : 'lang-inactive'}>EN</span>
              <span className={lang === 'es' ? 'lang-active' : 'lang-inactive'}>ES</span>
            </button>

            <a href="#cta" className="btn" onClick={handleNavClick}>
              <span>{t('nav.quote')}</span>
              <ArrowIcon />
            </a>

            <button
              className={`hamburger${isOpen ? ' active' : ''}`}
              onClick={toggleMenu}
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay${isOpen ? ' open' : ''}`}
        onClick={toggleMenu}
      />

      {/* Mobile menu */}
      <div className={`mobile-menu${isOpen ? ' open' : ''}`}>
        {isPortfolio && (
          <Link
            href="/"
            className="mobile-menu-back"
            onClick={() => setIsOpen(false)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11.5 6.5h-10M6.5 1.5l-5 5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{t('portfolio.back')}</span>
          </Link>
        )}

        {!isPortfolio && NAV_LINKS.map(link => (
          <a
            key={link.key}
            href={link.href}
            className={activeNav === link.href ? 'nav-active' : ''}
            onClick={handleNavClick}
          >
            {t(link.key)}
          </a>
        ))}

        {isPortfolio && (
          <>
            <a
              href="#"
              className={activeSection === 'video' ? 'nav-active' : ''}
              onClick={(e) => { e.preventDefault(); handlePortfolioNav('video') }}
            >
              {t('portfolio.video')}
            </a>
            <a
              href="#"
              className={activeSection === 'photo' ? 'nav-active' : ''}
              onClick={(e) => { e.preventDefault(); handlePortfolioNav('photo') }}
            >
              {t('portfolio.photo')}
            </a>
          </>
        )}

        <button
          className="lang-toggle"
          onClick={toggleLang}
          aria-label="Change language"
          style={{ marginTop: 16, alignSelf: 'flex-start', fontSize: 14, padding: '8px 14px', gap: 4 }}
        >
          <span className={lang === 'en' ? 'lang-active' : 'lang-inactive'}>EN</span>
          <span className={lang === 'es' ? 'lang-active' : 'lang-inactive'}>ES</span>
        </button>

        <a
          href="#cta"
          className="btn mobile-menu-cta"
          onClick={handleNavClick}
          style={{ marginTop: 16, textAlign: 'center', textDecoration: 'none' }}
        >
          <span>{t('nav.quote')}</span>
        </a>

        {!isPortfolio && (
          <div className="mobile-menu-socials">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
