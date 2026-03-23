'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useI18n } from '@/i18n/context'

interface Client { name: string; logo: string }

export default function ClientsWall() {
  const { t } = useI18n()
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetch('/content/clients.json')
      .then(r => r.json())
      .then(data => setClients(data.items))
      .catch(console.error)
  }, [])

  return (
    <section id="clients-wall">
      <div className="container">
        <div className="clients-wall-inner">
          <div className="clients-wall-header reveal">
            <div className="section-label" style={{marginBottom: '14px'}}>{t('clients.label')}</div>
            <h2 className="disp" style={{fontSize: 'clamp(40px,5vw,62px)', letterSpacing: '0.04em'}}>{t('clients.title')}</h2>
          </div>
          <div className="clients-grid reveal">
            {clients.map((c, i) => (
              <div key={i} className="client-logo-card">
                <Image className="client-logo-img" src={c.logo} alt={c.name} width={120} height={60} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
