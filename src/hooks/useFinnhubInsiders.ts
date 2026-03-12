import { useState, useEffect } from 'react'
import type { InsiderTransaction } from '@/data/dueDiligenceData'
import { mockInsiderTransactions } from '@/data/dueDiligenceData'
import { fetchInsiderTransactions } from '@/services/finnhub'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export function useFinnhubInsiders(ticker: string) {
  const [data, setData]       = useState<InsiderTransaction[]>(mockInsiderTransactions)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const load = API_URL
      // ── Backend route ─────────────────────────────────────────────────────
      ? fetch(`${API_URL}/api/insiders/${ticker}`)
          .then((r) => {
            if (!r.ok) throw new Error(`Backend ${r.status}`)
            return r.json() as Promise<InsiderTransaction[]>
          })
          .then((txns) => {
            if (txns.length > 0) setData(txns)
          })
      // ── Direct Finnhub ────────────────────────────────────────────────────
      : fetchInsiderTransactions(ticker)
          .then((raw: { data?: Array<{
            name: string; change: number
            transactionDate: string; transactionPrice: number
          }> }) => {
            if (raw?.data && raw.data.length > 0) {
              setData(raw.data.slice(0, 20).map((item) => ({
                name:            item.name,
                title:           'Executive',
                transactionType: item.change > 0 ? 'buy' : 'sell',
                shares:          Math.abs(item.change),
                value:           Math.abs(item.change) * (item.transactionPrice ?? 0),
                date:            item.transactionDate,
                isUnusual:       false,
              })))
            }
          })

    load
      .catch(() => { /* silently keep mock data */ })
      .finally(() => setLoading(false))
  }, [ticker])

  return { data, loading }
}
