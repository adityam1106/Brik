const BASE = 'https://api.goperigon.com/v1'
const KEY = import.meta.env.VITE_PERIGON_KEY ?? ''

export async function fetchMarketIntel(company: string) {
  if (!KEY) throw new Error('No Perigon key')
  const res = await fetch(
    `${BASE}/all?q=${encodeURIComponent(company)}&apiKey=${KEY}`
  )
  if (!res.ok) throw new Error(`Perigon error: ${res.status}`)
  return res.json()
}
