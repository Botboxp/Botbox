'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'

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
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M10 7L7 5v4l3-2z" fill="currentColor"/></svg>,
  },
  {
    key: 'form.type.music',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 5l3 2-3 2V5z" fill="currentColor"/></svg>,
  },
  {
    key: 'form.type.photo',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 5.5l3-1.5v6l-3-1.5v-3z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    key: 'form.type.doc',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 10V4l4.5 3 2.5-3 4 1v5l-4-2.5-2.5 2.5-4.5 0z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    key: 'form.type.corp',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11V4l2.5 1.5L7 3l2.5 1.5L12 4v7H2z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    key: 'form.type.other',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
]

const ContactIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M1.5 1.5h10v10h-10z" stroke="#888" strokeWidth="1.1" />
    <path d="M1.5 4l5 3.5 5-3.5" stroke="#888" strokeWidth="1.1" />
  </svg>
)

export default function CTA() {
  const { t } = useI18n()
  const [contact, setContact] = useState<ContactData | null>(null)
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

  useEffect(() => {
    fetch('/content/contact.json')
      .then(r => r.json())
      .then(data => setContact(data))
      .catch(console.error)
  }, [])

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
  const btnLabel = sent
    ? t('form.sent')
    : sending
      ? '...'
      : error
        ? t('form.error')
        : currentStep < 3
          ? t('form.next')
          : t('form.send')

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
              {contact?.contacts.map((c, i) => (
                <div key={i} className="cta-contact-item">
                  <div className="cta-contact-icon"><ContactIcon /></div>
                  <div>
                    <div className="cta-contact-label">{c.name} &middot; {c.role}</div>
                    <div className="cta-contact-value">{c.phone}</div>
                  </div>
                </div>
              ))}
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

              <button
                type="button"
                className="btn btn-solid"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleSubmit}
                disabled={sending || sent}
              >
                <span>{btnLabel}</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
