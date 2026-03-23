export interface BotboxEventMap {
  openVideo: string
  openLightbox: { images: string[]; index: number }
  portfolioSection: 'video' | 'photo'
  portfolioSectionChanged: 'video' | 'photo'
}

export function dispatchTyped<K extends keyof BotboxEventMap>(
  type: K,
  detail: BotboxEventMap[K]
) {
  window.dispatchEvent(new CustomEvent(type, { detail }))
}

export function listenTyped<K extends keyof BotboxEventMap>(
  type: K,
  handler: (detail: BotboxEventMap[K]) => void
) {
  const listener = (e: Event) => handler((e as CustomEvent).detail)
  window.addEventListener(type, listener)
  return () => window.removeEventListener(type, listener)
}
