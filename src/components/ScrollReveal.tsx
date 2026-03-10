'use client'
import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    // Observe all reveal elements, re-check periodically for dynamically added ones
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    }

    observeAll()

    // MutationObserver to catch dynamically added elements
    const mutationObs = new MutationObserver(() => {
      observeAll()
    })
    mutationObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObs.disconnect()
    }
  }, [])

  return null
}
