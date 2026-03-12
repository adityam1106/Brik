import { useState, useEffect } from 'react'
import type { MarketIntelItem } from '@/data/dueDiligenceData'
import { mockMarketIntel } from '@/data/dueDiligenceData'
import { fetchMarketIntel } from '@/services/perigon'

export function usePerigonIntel(company: string) {
  const [data, setData] = useState<MarketIntelItem[]>(mockMarketIntel)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchMarketIntel(company)
      .then((raw: { articles?: Array<{
        title: string
        description: string
        source: { name: string }
        pubDate: string
      }> }) => {
        if (raw?.articles && Array.isArray(raw.articles) && raw.articles.length > 0) {
          const mapped: MarketIntelItem[] = raw.articles.slice(0, 6).map((item) => ({
            category: 'Industry Trend',
            insight: item.description ?? item.title,
            trend: 'neutral' as const,
            source: item.source?.name ?? 'Perigon',
            date: item.pubDate ? item.pubDate.split('T')[0] : '',
            impact: 'medium' as const,
          }))
          setData(mapped)
        }
      })
      .catch(() => {
        // silently fall back to mock data
      })
      .finally(() => setLoading(false))
  }, [company])

  return { data, loading }
}
