'use client'
import { useEffect, useState, useCallback } from 'react'
import { useI18n } from '@/i18n/context'

export default function VideoModal() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)

  const open = useCallback((e: Event) => {
    const id = (e as CustomEvent).detail
    setVideoId(id)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setVideoId(null)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    window.addEventListener('openVideo', open)
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('openVideo', open)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, close, isOpen])

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) close() }}>
      <div className="modal-box">
        <button className="modal-close" onClick={close}>✕</button>
        <div className="modal-content-inner">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          ) : (
            <div className="modal-placeholder">
              <div className="modal-play-big">
                <svg width="26" height="30" viewBox="0 0 26 30" fill="none"><path d="M1 1.5l24 13L1 28V1.5z" fill="white"/></svg>
              </div>
              <p>{t('modal.showreel')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
