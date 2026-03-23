'use client'

import { useState } from 'react'
import { useI18n } from '@/i18n/context'
import { useContent } from '@/hooks/useContent'

interface ContactPerson { name: string; role: string; phone: string }
interface ContactData {
  email: string
  cta_title: string
  cta_subtitle: string
  contacts: ContactPerson[]
}

const PROJECT_TYPES = [
  {
    key: 'form.type.video',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h8v2H2zM2 4h10v8H2z" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4v8M8 4v8" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    key: 'form.type.music',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 12V3.5L11 2.5v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="3.5" cy="11.5" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="9" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    key: 'form.type.photo',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3.5" width="12" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 3.5L5.5 2h3l1 1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    key: 'form.type.doc',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5h11" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 2v3" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="8.5" r="0.8" fill="currentColor"/></svg>,
  },
  {
    key: 'form.type.corp',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 12V3h8v9" stroke="currentColor" strokeWidth="1.2"/><path d="M1 12h12" stroke="currentColor" strokeWidth="1.2"/><rect x="5" y="5" width="1.5" height="1.5" fill="currentColor"/><rect x="7.5" y="5" width="1.5" height="1.5" fill="currentColor"/><rect x="5" y="7.5" width="1.5" height="1.5" fill="currentColor"/><rect x="7.5" y="7.5" width="1.5" height="1.5" fill="currentColor"/></svg>,
  },
  {
    key: 'form.type.other',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3.5" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7" r="1.2" fill="currentColor"/></svg>,
  },
]

const ContactIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#888"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#888" strokeWidth="1.5" fill="none"/>
  </svg>
)

export default function CTA() {
  const { t } = useI18n()
  const { data: contact } = useContent<ContactData>('/content/contact.json')
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [touched, setTouched] = useState(false)
  const [website, setWebsite] = useState('')

  const handleSubmit = async () => {
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      setTouched(true)
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      if (!name || !email || !emailValid) return
      setTouched(false)
      setCurrentStep(3)
      return
    }

    if (website) return

    setSending(true)
    setError(false)

    const projectType = t(PROJECT_TYPES[selectedIdx].key)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: company || 'N/A',
          projectType,
          message: message || 'No message provided.',
          website,
        }),
      })

      if (res.ok) {
        setSent(true)
        setTimeout(() => {
          setCurrentStep(1)
          setName(''); setEmail(''); setCompany(''); setMessage('')
          setSelectedIdx(0)
          setSent(false)
        }, 3000)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  const stepLabel = currentStep === 1 ? t('form.step1') : currentStep === 2 ? t('form.step2') : t('form.step3')

  return (
    <section id="cta">
      <div className="container">
        <div className="cta-inner">
          <div className="reveal">
            <div className="section-label" style={{ marginBottom: 20 }}>{t('cta.label')}</div>
            <h2 className="cta-title disp" dangerouslySetInnerHTML={{ __html: t('cta.title') }} />
            <p className="cta-subtitle">{t('cta.subtitle')}</p>
            <a href={`mailto:${contact?.email || 'info@botboxp.com'}`} className="btn btn-solid">
              <span>{contact?.email || 'info@botboxp.com'}</span>
            </a>
            <div className="cta-contact">
              {contact?.contacts.map((c, i) => {
                const waNumber = c.phone.replace(/\D/g, '')
                const displayPhone = `+1 (${waNumber.slice(0, 3)}) ${waNumber.slice(3, 6)}-${waNumber.slice(6)}`
                return (
                  <div key={i} className="cta-contact-item">
                    <a href={`https://wa.me/1${waNumber}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
                      <div className="cta-contact-icon"><ContactIcon /></div>
                      <div>
                        <div className="cta-contact-label">{c.name} &middot; {c.role}</div>
                        <div className="cta-contact-value">{displayPhone}</div>
                      </div>
                    </a>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => { navigator.clipboard.writeText(`+1${waNumber}`) }}
                      title="Copy number"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <form className="quote-form" onSubmit={e => e.preventDefault()}>
              <div className="form-steps-bar">
                <div className={`form-step-seg${currentStep >= 1 ? ' active' : ''}`} />
                <div className={`form-step-seg${currentStep >= 2 ? ' active' : ''}`} />
                <div className={`form-step-seg${currentStep >= 3 ? ' active' : ''}`} />
              </div>
              <div className="form-step-label">{stepLabel}</div>
              <h3 className="form-title disp">{t('form.title')}</h3>

              {currentStep === 1 && (
                <div className="project-types">
                  {PROJECT_TYPES.map((pt, i) => (
                    <button
                      key={pt.key}
                      type="button"
                      className={`project-type-btn${selectedIdx === i ? ' selected' : ''}`}
                      onClick={() => setSelectedIdx(i)}
                    >
                      {pt.icon}
                      <span>{t(pt.key)}</span>
                    </button>
                  ))}
                </div>
              )}

              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="website">Website</label>
                <input id="website" type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} autoComplete="off" tabIndex={-1} />
              </div>

              {currentStep === 2 && (
                <>
                  <div className="form-row">
                    <input
                      className={`form-input${touched && !name ? ' input-error' : ''}`}
                      type="text"
                      placeholder={t('form.ph.name')}
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <input
                      className={`form-input${touched && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? ' input-error' : ''}`}
                      type="email"
                      placeholder={t('form.ph.email')}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <input
                    className="form-input"
                    type="text"
                    placeholder={t('form.ph.company')}
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </>
              )}

              {currentStep === 3 && (
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder={t('form.ph.message')}
                  style={{ resize: 'none' }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              )}

              {sent && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>&#10003;</div>
                  <p style={{ color: 'var(--accent-a)', fontWeight: 600, fontSize: '16px' }}>{t('form.sent')}</p>
                </div>
              )}

              {error && (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#ff6b6b', fontSize: '14px', marginBottom: '8px' }}>
                  {t('form.error')}
                </div>
              )}

              {!sent && (
                <button
                  type="button"
                  className="btn btn-solid"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleSubmit}
                  disabled={sending}
                >
                  <span>{sending ? '...' : currentStep < 3 ? t('form.next') : t('form.send')}</span>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
