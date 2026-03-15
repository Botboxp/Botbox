'use client'

import { useState } from 'react'
import { useI18n } from '@/i18n/context'

export default function Footer() {
  const { t } = useI18n()
  const [logoError, setLogoError] = useState(false)

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div>
            <div className="footer-logo">
              {!logoError ? (
                <img
                  src="/assets/img/logos/botbox-logo.png"
                  alt="Botbox Production"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="footer-logo-text">BOTBOX PRODUCTION</span>
              )}
            </div>
            <div className="footer-tagline">{t('footer.tagline')}</div>
            <p className="footer-about">{t('footer.about')}</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/botboxp/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m-.25 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9m10.16 1.13a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6"/></svg>
              </a>
              <a href="https://www.facebook.com/botboxp/?checkpoint_src=any" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/></svg>
              </a>
              <a href="https://youtube.com/@botboxproduction5632?si=a-tymoCWaScnibaw" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 0 0 2.42 7.19 26.4 26.4 0 0 0 2 12a26.4 26.4 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77A26.4 26.4 0 0 0 22 12a26.4 26.4 0 0 0-.42-4.81M10 15V9l5.2 3L10 15"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/botbox-productions/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <div className="footer-col-title">{t('footer.services')}</div>
            <ul className="footer-links">
              <li><a href="#services">{t('footer.svc.video')}</a></li>
              <li><a href="#services">{t('footer.svc.music')}</a></li>
              <li><a href="#services">{t('footer.svc.corporate')}</a></li>
              <li><a href="#services">{t('footer.svc.photography')}</a></li>
              <li><a href="#services">{t('footer.svc.events')}</a></li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <div className="footer-col-title">{t('footer.navigation')}</div>
            <ul className="footer-links">
              <li><a href="#hero">{t('footer.nav.home')}</a></li>
              <li><a href="#videos">{t('footer.nav.video')}</a></li>
              <li><a href="#photos">{t('footer.nav.photo')}</a></li>
              <li><a href="#clients-wall">{t('footer.nav.clients')}</a></li>
              <li><a href="#process">{t('footer.nav.process')}</a></li>
              <li><a href="#cta">{t('footer.nav.quote')}</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <div className="footer-col-title">{t('footer.contact')}</div>
            <div className="footer-contact-item">
              <div className="footer-contact-label">{t('footer.email')}</div>
              <div className="footer-contact-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <a href="mailto:info@botboxp.com">info@botboxp.com</a>
                <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText('info@botboxp.com')} title="Copy email">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-label">Daniel Lares &middot; Director</div>
              <div className="footer-contact-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <a href="https://wa.me/13055464487" target="_blank" rel="noopener noreferrer">+1 (305) 546-4487</a>
                <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText('+13055464487')} title="Copy number">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-label">Angel Pierini &middot; Photography</div>
              <div className="footer-contact-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <a href="https://wa.me/13057769016" target="_blank" rel="noopener noreferrer">+1 (305) 776-9016</a>
                <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText('+13057769016')} title="Copy number">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-label">{t('footer.location')}</div>
              <div className="footer-contact-value">Miami, FL 33186</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">{t('footer.copy')}</div>
          <div className="footer-location">{t('footer.loc')}</div>
          <div className="footer-credit" style={{ fontSize: '11px', color: 'var(--grey)', letterSpacing: '0.1em' }}>
            Made by{' '}
            <a href="https://techode.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-a)', textDecoration: 'none' }}>
              techode.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
