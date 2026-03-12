import { useState, useEffect } from 'react'
import type { NewsArticle } from '@/data/dueDiligenceData'
import { mockNewsArticles } from '@/data/dueDiligenceData'
import { fetchCompanyNews } from '@/services/finnhub'

export function useFinnhubNews(ticker: string) {
  const [data, setData] = useState<NewsArticle[]>(mockNewsArticles)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const today = new Date()
    const from = new Date(today)
    from.setDate(from.getDate() - 30)
    const toStr = today.toISOString().split('T')[0]
    const fromStr = from.toISOString().split('T')[0]

    setLoading(true)
    fetchCompanyNews(ticker, fromStr, toStr)
      .then((raw: Array<{
        id: number
        headline: string
        source: string
        url: string
        datetime: number
        summary: string
        category: string
      }>) => {
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: NewsArticle[] = raw.slice(0, 20).map((item) => ({
            id: String(item.id),
            headline: item.headline,
            source: item.source,
            url: item.url,
            timestamp: item.datetime * 1000,
            sentiment: 'neutral' as const,
            sentimentScore: 0.5,
            summary: item.summary,
            category: item.category,
          }))
          setData(mapped)
        }
      })
      .catch(() => {
        // silently fall back to mock data
      })
      .finally(() => setLoading(false))
  }, [ticker])

  return { data, loading }
}
