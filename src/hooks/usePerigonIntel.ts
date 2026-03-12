import { useState, useEffect } from 'react'
import type { MarketIntelItem } from '@/data/dueDiligenceData'
import { mockMarketIntel } from '@/data/dueDiligenceData'
import { fetchMarketIntel } from '@/services/perigon'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export function usePerigonIntel(company: string) {
  const [data, setData]       = useState<MarketIntelItem[]>(mockMarketIntel)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const load = API_URL
      // ── Backend route ─────────────────────────────────────────────────────
      ? fetch(`${API_URL}/api/market/${encodeURIComponent(company)}`)
          .then((r) => {
            if (!r.ok) throw new Error(`Backend ${r.status}`)
            return r.json() as Promise<MarketIntelItem[]>
          })
          .then((items) => {
            if (items.length > 0) setData(items)
          })
      // ── Direct Perigon ────────────────────────────────────────────────────
      : fetchMarketIntel(company)
          .then((raw: { articles?: Array<{
            title: string; description: string
            source: { name: string }; pubDate: string
          }> }) => {
            if (raw?.articles && raw.articles.length > 0) {
              setData(raw.articles.slice(0, 6).map((item) => ({
                category: 'Industry Trend',
                insight:  item.description ?? item.title,
                trend:    'neutral' as const,
                source:   item.source?.name ?? 'Perigon',
                date:     item.pubDate ? item.pubDate.split('T')[0] : '',
                impact:   'medium' as const,
              })))
            }
          })

    load
      .catch(() => { /* silently keep mock data */ })
      .finally(() => setLoading(false))
  }, [company])

  return { data, loading }
}
