'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'

interface TestimonialItem {
  quote: string
  name: string
  role: string
  avatar: string
}

export default function Testimonials() {
  const { t } = useI18n()
  const [items, setItems] = useState<TestimonialItem[]>([])
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetch('/content/testimonials.json')
      .then(res => res.json())
      .then((data: { items: TestimonialItem[] }) => setItems(data.items))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const showToggle = isMobile && items.length > 2

  return (
    <section id="testimonials">
      <div className="container">
        <div className="test-header reveal">
          <div className="section-label" style={{ marginBottom: 14 }}>{t('test.label')}</div>
          <h2 className="disp" style={{ fontSize: 'clamp(40px, 5vw, 62px)', letterSpacing: '0.04em' }}>
            {t('test.title')}
          </h2>
        </div>

        <div className={`test-grid${showToggle && collapsed ? ' test-collapsed' : ''}`} id="testimonialsGrid">
          {items.map((item, i) => {
            const idx = i + 1
            return (
              <div key={idx} className={`test-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
                <span className="test-quote-mark">&ldquo;</span>
                <p className="test-text">{t(`test.${idx}.quote`)}</p>
                <div className="test-author">
                  <div className="test-avatar disp">{item.avatar}</div>
                  <div>
                    <div className="test-name">{t(`test.${idx}.name`)}</div>
                    <div className="test-role">{t(`test.${idx}.role`)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {showToggle && (
          <button
            className="view-more-btn"
            id="testViewMore"
            onClick={() => setCollapsed(prev => !prev)}
          >
            {collapsed ? t('btn.viewmore') : t('btn.showless')}
          </button>
        )}
      </div>
    </section>
  )
}
