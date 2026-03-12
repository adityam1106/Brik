const BASE = 'https://finnhub.io/api/v1'
const KEY = import.meta.env.VITE_FINNHUB_KEY ?? ''

export async function fetchCompanyNews(ticker: string, from: string, to: string) {
  if (!KEY) throw new Error('No Finnhub key')
  const res = await fetch(
    `${BASE}/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${KEY}`
  )
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`)
  return res.json()
}

export async function fetchSentiment(ticker: string) {
  if (!KEY) throw new Error('No Finnhub key')
  const res = await fetch(`${BASE}/news-sentiment?symbol=${ticker}&token=${KEY}`)
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`)
  return res.json()
}

export async function fetchInsiderTransactions(ticker: string) {
  if (!KEY) throw new Error('No Finnhub key')
  const res = await fetch(`${BASE}/stock/insider-transactions?symbol=${ticker}&token=${KEY}`)
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`)
  return res.json()
}
