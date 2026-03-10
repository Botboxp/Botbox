'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { Lang, t as translate } from './translations'

interface I18nContextType {
  lang: Lang
  t: (key: string) => string
  toggleLang: () => void
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  t: (key) => key,
  toggleLang: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('botbox-lang') as Lang | null
    if (saved === 'en' || saved === 'es') {
      setLang(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('botbox-lang', lang)
  }, [lang])

  const t = useCallback((key: string) => translate(key, lang), [lang])

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'es' : 'en')
  }, [])

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
