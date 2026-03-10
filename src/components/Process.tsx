'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/i18n/context'

const STEPS = [
  { num: '01', titleKey: 'process.step1.title', descKey: 'process.step1.desc', delay: '' },
  { num: '02', titleKey: 'process.step2.title', descKey: 'process.step2.desc', delay: 'reveal-delay-1' },
  { num: '03', titleKey: 'process.step3.title', descKey: 'process.step3.desc', delay: 'reveal-delay-2' },
  { num: '04', titleKey: 'process.step4.title', descKey: 'process.step4.desc', delay: 'reveal-delay-3' },
]

export default function Process() {
  const { t } = useI18n()
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.innerWidth > 768) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const numberEl = entry.target.querySelector('.step-number')
          if (!numberEl) return
          if (entry.isIntersecting) {
            numberEl.classList.add('step-active')
          } else {
            numberEl.classList.remove('step-active')
          }
        })
      },
      { threshold: 0.5 }
    )

    stepsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="process">
      <div className="container">
        <div className="process-header reveal">
          <div className="section-label" style={{ marginBottom: 14 }}>
            {t('process.label')}
          </div>
          <h2
            className="disp"
            style={{
              fontSize: 'clamp(40px, 5vw, 62px)',
              letterSpacing: '0.04em',
            }}
          >
            {t('process.title')}
          </h2>
        </div>
        <div className="process-steps">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`process-step reveal${step.delay ? ` ${step.delay}` : ''}`}
              ref={(el) => { stepsRef.current[i] = el }}
            >
              <div className="step-number disp">{step.num}</div>
              <div className="step-content">
                <h3 className="step-title disp">{t(step.titleKey)}</h3>
                <p className="step-desc">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
