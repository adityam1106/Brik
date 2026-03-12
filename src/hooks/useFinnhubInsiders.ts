import { useState, useEffect } from 'react'
import type { InsiderTransaction } from '@/data/dueDiligenceData'
import { mockInsiderTransactions } from '@/data/dueDiligenceData'
import { fetchInsiderTransactions } from '@/services/finnhub'

export function useFinnhubInsiders(ticker: string) {
  const [data, setData] = useState<InsiderTransaction[]>(mockInsiderTransactions)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchInsiderTransactions(ticker)
      .then((raw: { data?: Array<{
        name: string
        share: number
        change: number
        transactionDate: string
        transactionCode: string
        transactionPrice: number
      }> }) => {
        if (raw?.data && Array.isArray(raw.data) && raw.data.length > 0) {
          const mapped: InsiderTransaction[] = raw.data.slice(0, 20).map((item) => ({
            name: item.name,
            title: 'Executive',
            transactionType: item.change > 0 ? 'buy' : 'sell',
            shares: Math.abs(item.change),
            value: Math.abs(item.change) * (item.transactionPrice ?? 0),
            date: item.transactionDate,
            isUnusual: false,
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
