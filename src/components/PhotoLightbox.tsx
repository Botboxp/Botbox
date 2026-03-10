'use client'
import { useEffect, useState, useCallback } from 'react'

export default function PhotoLightbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [index, setIndex] = useState(0)

  const open = useCallback((e: Event) => {
    const { images: imgs, index: idx } = (e as CustomEvent).detail
    setImages(imgs)
    setIndex(idx)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  const nav = useCallback((dir: number) => {
    setIndex(prev => (prev + dir + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    window.addEventListener('openLightbox', open)
    return () => window.removeEventListener('openLightbox', open)
  }, [open])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') nav(-1)
      if (e.key === 'ArrowRight') nav(1)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close, nav])

  return (
    <div className={`lightbox${isOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) close() }}>
      <button className="lightbox-close" onClick={close}>✕</button>
      <button className="lightbox-nav lightbox-prev" onClick={() => nav(-1)}>‹</button>
      {images.length > 0 && <img className="lightbox-img" src={images[index]} alt="" />}
      <button className="lightbox-nav lightbox-next" onClick={() => nav(1)}>›</button>
    </div>
  )
}
