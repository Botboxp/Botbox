'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useI18n } from '@/i18n/context'
import { listenTyped } from '@/types/events'

export default function VideoModal() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setVideoId(null)
    document.body.style.overflow = ''
    previousFocusRef.current?.focus()
  }, [])

  /* Focus close button when modal opens */
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    return listenTyped('openVideo', (id) => {
      previousFocusRef.current = document.activeElement as HTMLElement
      setVideoId(id)
      setIsOpen(true)
      document.body.style.overflow = 'hidden'
    })
  }, [])

  /* Keyboard: Escape to close, trap focus inside modal */
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, close])

  return (
    <div
      ref={overlayRef}
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('modal.showreel')}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="modal-box">
        <button ref={closeRef} className="modal-close" onClick={close} aria-label="Close">✕</button>
        <div className="modal-content-inner">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="Video player"
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
