// Batch Live Market Quotes Fetcher (Yahoo Finance IDX Multi-Ticker Bridge)
// Mengambil harga terkini langsung dari bursa via Yahoo Finance API

const liveCache = new Map()
const CACHE_TTL_MS = 60 * 1000 // Cache 1 menit

export async function fetchLiveBatchQuotes(tickers = []) {
  if (!tickers || tickers.length === 0) return {}

  const now = Date.now()
  const toFetch = []
  const quotes = {}

  for (const t of tickers) {
    const cached = liveCache.get(t)
    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      quotes[t] = cached.data
    } else {
      toFetch.push(t)
    }
  }

  if (toFetch.length === 0) {
    return quotes
  }

  // Fetch parallel per-ticker via proxy Vite /api/yahoo/v8/finance/chart/{ticker}.JK
  const promises = toFetch.map(async (ticker) => {
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${ticker}.JK?interval=1d&range=5d`, {
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        const json = await res.json()
        const meta = json?.chart?.result?.[0]?.meta
        if (meta) {
          const price = meta.regularMarketPrice || meta.chartPreviousClose || 0
          const prevClose = meta.chartPreviousClose || price
          const change = Math.round(price - prevClose)
          const changePct = Number(((change / prevClose) * 100).toFixed(2))

          const timestamps = json?.chart?.result?.[0]?.timestamp || []
          const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []
          const history = timestamps.map((ts, idx) => ({
            date: new Date(ts * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            price: Math.round(closes[idx] || price),
            volume: json?.chart?.result?.[0]?.indicators?.quote?.[0]?.volume?.[idx] || 150000
          })).filter(p => !isNaN(p.price) && p.price > 0)

          const data = {
            price: Math.round(price),
            change,
            changePct,
            history: history.length ? history : null,
            isLive: true
          }
          liveCache.set(ticker, { timestamp: now, data })
          return { ticker, data }
        }
      }
    } catch (e) {
      console.warn(`Live quote fetch error for ${ticker}`, e)
    }
    return null
  })

  const results = await Promise.allSettled(promises)
  results.forEach(r => {
    if (r.status === 'fulfilled' && r.value) {
      quotes[r.value.ticker] = r.value.data
    }
  })

  return quotes
}
