'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/context'

interface Client {
  name: string
  logo: string
}

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export default function ClientTicker() {
  const { t } = useI18n()
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetch('/content/clients.json')
      .then(r => r.json())
      .then(data => setClients(data.items))
      .catch(console.error)
  }, [])

  const items = [...clients, ...clients]

  return (
    <div id="clients-ticker">
      <div className="ticker-inner">
        <div className="ticker-label">{t('ticker.label')}</div>
        <div className="ticker-track">
          <div className="ticker-list">
            {items.map((c, i) => (
              <span key={i}>
                <span className="ticker-item">
                  <img src={prefixPath(c.logo)} alt={c.name} />
                </span>
                <span className="ticker-dot"></span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
