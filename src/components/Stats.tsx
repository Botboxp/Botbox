'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/context'

const STATS = [
  { target: 15, label: 'stat.years', delay: '' },
  { target: 50, label: 'stat.brands', delay: 'reveal-delay-1' },
  { target: 200, label: 'stat.projects', delay: 'reveal-delay-2' },
  { target: 13, label: 'stat.countries', delay: 'reveal-delay-3' },
]

function StatNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          entry.target.classList.add('visible')
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let frame = 0
    const totalFrames = 40
    const interval = setInterval(() => {
      frame++
      setCount(Math.round(target * (frame / totalFrames)))
      if (frame >= totalFrames) {
        setCount(target)
        clearInterval(interval)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [started, target])

  return (
    <div className="stat-number disp" ref={ref}>
      <span>{count}</span><span>+</span>
    </div>
  )
}

export default function Stats() {
  const { t } = useI18n()

  return (
    <section id="stats">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={`stat-card reveal${stat.delay ? ` ${stat.delay}` : ''}`}
            >
              <StatNumber target={stat.target} />
              <div className="stat-label">{t(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
