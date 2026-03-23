'use client'

import Image from 'next/image'
import { useI18n } from '@/i18n/context'
import { useContent } from '@/hooks/useContent'

interface Client {
  name: string
  logo: string
}

function prefixPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

interface ClientsData {
  items: Client[]
}

export default function ClientTicker() {
  const { t } = useI18n()
  const { data } = useContent<ClientsData>('/content/clients.json')
  const clients = data?.items ?? []

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
                  <Image src={prefixPath(c.logo)} alt={c.name} width={80} height={40} loading="lazy" />
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
