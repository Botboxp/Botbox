'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/context'

interface StatItem {
  target: number
  label: string
}

const DELAYS = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3']

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
  const [stats, setStats] = useState<StatItem[]>([])

  useEffect(() => {
    fetch('/content/stats.json')
      .then(r => r.json())
      .then(data => setStats(data.items))
      .catch(() => setStats([
        { target: 15, label: 'stat.years' },
        { target: 50, label: 'stat.brands' },
        { target: 200, label: 'stat.projects' },
        { target: 13, label: 'stat.countries' },
      ]))
  }, [])

  return (
    <section id="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-card reveal${DELAYS[i] ? ` ${DELAYS[i]}` : ''}`}
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
