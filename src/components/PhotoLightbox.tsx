'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { listenTyped } from '@/types/events'

export default function PhotoLightbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
    previousFocusRef.current?.focus()
  }, [])

  const nav = useCallback((dir: number) => {
    setIndex(prev => (prev + dir + images.length) % images.length)
  }, [images.length])

  /* Focus close button when lightbox opens */
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    return listenTyped('openLightbox', ({ images: imgs, index: idx }) => {
      previousFocusRef.current = document.activeElement as HTMLElement
      setImages(imgs)
      setIndex(idx)
      setIsOpen(true)
      document.body.style.overflow = 'hidden'
    })
  }, [])

  /* Keyboard: Escape, arrows, focus trap */
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') nav(-1)
      if (e.key === 'ArrowRight') nav(1)
      if (e.key === 'Tab' && lightboxRef.current) {
        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close, nav])

  return (
    <div
      ref={lightboxRef}
      className={`lightbox${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${images.length}`}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <button ref={closeRef} className="lightbox-close" onClick={close} aria-label="Close">✕</button>
      <button className="lightbox-nav lightbox-prev" onClick={() => nav(-1)} aria-label="Previous photo">‹</button>
      {images.length > 0 && <Image className="lightbox-img" src={images[index]} alt={`Photo ${index + 1} of ${images.length}`} width={1200} height={800} loading="eager" style={{ objectFit: 'contain', width: '100%', height: 'auto' }} />}
      <button className="lightbox-nav lightbox-next" onClick={() => nav(1)} aria-label="Next photo">›</button>
    </div>
  )
}
