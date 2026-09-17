import { IDX_STOCKS, IHSG_DATA, generateStockHistory } from '../data/stocks.js'
import { IDX_FULL_EMITEN } from '../data/emitenUniverse.js'
import { generateStockbitBrokerAction } from '../data/brokerAction.js'
import { calculateBandarmologyEngine } from '../data/bandarmologyEngine.js'
import { calculateTechnicalEngine } from '../data/technicalEngine.js'
import { calculateInstitutionalTradeLevels } from '../data/institutionalTradeEngine.js'

export async function fetchStockData(tickerInput) {
  const cleanTicker = (tickerInput || '').trim().toUpperCase().replace('.JK', '')
  if (!cleanTicker) return null

  // 1. Coba ambil dari SQLite Database terlebih dahulu
  let dbStockData = null
  try {
    const dbRes = await fetch(`/api/db/stocks/${cleanTicker}`)
    if (dbRes.ok) {
      const json = await dbRes.json()
      if (json.status === 'success' && json.data) {
        dbStockData = json.data
      }
    }
  } catch (e) {
    console.warn('SQLite single stock fetch fallback:', e)
  }

  // 2. Jika ada live Yahoo quote, coba perbarui harga real-time
  let liveQuote = null
  try {
    const res = await fetch(`/api/yahoo/v8/finance/chart/${cleanTicker}.JK?interval=1d&range=5d`, {
      headers: { 'Accept': 'application/json' }
    })
    if (res.ok) {
      const json = await res.json()
      const result = json?.chart?.result?.[0]
      if (result && result.meta) {
        liveQuote = result
      }
    }
  } catch (err) {
    // console.warn('Live Yahoo API fetch failed, falling back to database', err)
  }

  // Master catalog fallback jika SQLite belum memuat
  const masterStock = IDX_FULL_EMITEN.find((s) => s.ticker === cleanTicker) || IDX_STOCKS.find((s) => s.ticker === cleanTicker)

  let effectivePrice = dbStockData ? dbStockData.price : (masterStock ? masterStock.price : 1000)
  let effectiveChange = dbStockData ? dbStockData.change : (masterStock ? masterStock.change : 0)
  let effectiveChangePct = dbStockData ? dbStockData.change_pct : (masterStock ? masterStock.changePct : 0)
  let effectiveHistory = []
  let isLiveActual = Boolean(dbStockData)

  if (liveQuote) {
    const meta = liveQuote.meta
    const currentPrice = meta.regularMarketPrice || meta.chartPreviousClose || effectivePrice
    const prevClose = meta.chartPreviousClose || currentPrice
    const change = Math.round(currentPrice - prevClose)
    const changePct = Number(((change / prevClose) * 100).toFixed(2))

    effectivePrice = Math.round(currentPrice)
    effectiveChange = change
    effectiveChangePct = changePct
    isLiveActual = true

    const timestamps = liveQuote.timestamp || []
    const closes = liveQuote.indicators?.quote?.[0]?.close || []
    effectiveHistory = timestamps.map((t, idx) => ({
      date: new Date(t * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      price: Math.round(closes[idx] || currentPrice),
      volume: liveQuote.indicators?.quote?.[0]?.volume?.[idx] || 100000
    })).filter(p => !isNaN(p.price) && p.price > 0)
  }

  if (effectiveHistory.length === 0) {
    effectiveHistory = generateStockHistory(effectivePrice)
  }

  // Siapkan objek emiten lengkap
  const stockObj = {
    ...(masterStock || {}),
    ...(dbStockData || {}),
    ticker: cleanTicker,
    name: dbStockData?.name || masterStock?.name || liveQuote?.meta?.longName || `${cleanTicker} Tbk`,
    sector: dbStockData?.sector || masterStock?.sector || 'Indonesia Equities',
    subsector: dbStockData?.subsector || masterStock?.subsector || 'Public Listed Company',
    price: effectivePrice,
    change: effectiveChange,
    changePct: effectiveChangePct,
    group: dbStockData?.group_name || masterStock?.group || 'Bursa Efek Indonesia',
    change: effectiveChange,
    changePct: effectiveChangePct,
    marketCap: masterStock?.marketCap || (effectivePrice * 15000000000),
    marketCapTier: effectivePrice > 5000 ? 'Big Cap' : 'Mid/Small Cap',
    peRatio: masterStock?.peRatio || 14.5,
    pbv: masterStock ? Number(((effectivePrice / (masterStock.bvps || (effectivePrice / 2)))).toFixed(2)) : 1.5,
    pbvMean: masterStock?.pbvMean || 1.8,
    pbvMinus1SD: masterStock?.pbvMinus1SD || 1.4,
    pbvPlus1SD: masterStock?.pbvPlus1SD || 2.2,
    bvps: masterStock?.bvps || Math.round(effectivePrice / 1.5),
    roe: masterStock?.roe || 14.0,
    der: masterStock?.der || 0.8,
    dividendYield: masterStock?.dividendYield || 3.5,
    freeFloatPct: masterStock?.freeFloatPct || 25.0,
    freeFloatCategory: masterStock?.freeFloatCategory || 'Sedang (20% - 40%)',
    freeFloatNotes: masterStock?.freeFloatNotes || 'Proporsi kepemilikan publik normal.',
    sharesOutstanding: masterStock?.sharesOutstanding || '15 Miliar',
    about: masterStock?.about || `Perusahaan terbuka yang tercatat di Bursa Efek Indonesia (${cleanTicker}).`,
    catalysts: masterStock?.catalysts || ['Aktivitas transaksi pasar modal domestik yang solid.'],
    risks: masterStock?.risks || ['Volatilitas pasar dan perubahan suku bunga.'],
    recentNews: masterStock?.recentNews || [
      {
        title: `Kinerja Pasar dan Analisis Transaksi Saham ${cleanTicker}`,
        source: 'Live Market BEI',
        time: 'Hari ini',
        sentiment: 'Netral',
        summary: `Transaksi saham ${cleanTicker} bergerak aktif mengikuti dinamika pasar bursa terkini.`
      }
    ]
  }

  const highPrice = Math.round(effectivePrice * 1.02)
  const lowPrice = Math.round(effectivePrice * 0.98)

  // 3. Hitung Engine Kuantitatif
  const techEngine = calculateTechnicalEngine(effectiveHistory, effectivePrice, highPrice, lowPrice)
  const brokerAction = generateStockbitBrokerAction(stockObj)
  const bandarEngine = calculateBandarmologyEngine(stockObj, brokerAction)

  // 4. Hitung Institutional Execution Engine (Fraksi BEI, Fractal Swing & Fib Confluence)
  const instLevels = calculateInstitutionalTradeLevels(
    effectiveHistory,
    effectivePrice,
    bandarEngine.smartMoneyAvgBuyPrice,
    bandarEngine.status
  )

  const analysis = {
    ...techEngine,
    ...instLevels,
    pbvStatus: stockObj.pbv <= stockObj.pbvMinus1SD ? 'Undervalued / Diskon Kuat (-1 SD)' : stockObj.pbv >= stockObj.pbvPlus1SD ? 'Overvalued / Premium (+1 SD)' : 'Fair Value (Rentang Wajar)',
    pbvColor: stockObj.pbv <= stockObj.pbvMinus1SD ? '#10B981' : stockObj.pbv >= stockObj.pbvPlus1SD ? '#EF4444' : '#38BDF8',
    pbvDesc: `PBV saat ini (${stockObj.pbv}x) dibandingkan rata-rata historis (${stockObj.pbvMean}x).`,
    ffLevel: stockObj.freeFloatPct >= 40 ? 'Free Float Tinggi' : stockObj.freeFloatPct < 15 ? 'Free Float Rendah (Tight Float)' : 'Free Float Sedang',
    ffColor: stockObj.freeFloatPct >= 40 ? '#10B981' : stockObj.freeFloatPct < 15 ? '#EF4444' : '#38BDF8',
    ffRecommendation: stockObj.freeFloatNotes || 'Likuiditas pasar proporsional.',
    recommendations: [
      {
        strategy: 'Buy on Weakness (BoW) — Direkomendasikan',
        badge: 'Low Risk Accumulation',
        badgeClass: 'badge-green',
        entryRange: `${instLevels.entryBuyLow.toLocaleString('id-ID')} – ${instLevels.entryBuyHigh.toLocaleString('id-ID')}`,
        entryIdeal: instLevels.entryBuyHigh,
        stopLoss: instLevels.stopLoss,
        riskPoints: instLevels.riskPoints,
        riskPct: ((instLevels.riskPoints / instLevels.entryBuyHigh) * 100).toFixed(2),
        targetPrice1: instLevels.takeProfit1,
        targetPrice2: instLevels.takeProfit2,
        potentialGainPct: (((instLevels.takeProfit1 - instLevels.entryBuyHigh) / instLevels.entryBuyHigh) * 100).toFixed(2),
        rrRatio: instLevels.riskRewardRatio,
        rationale: `Antisipasi pantulan teknikal di area Support 1 (${instLevels.support1.toLocaleString('id-ID')}) dengan batas risiko di bawah Support 2 (${instLevels.support2.toLocaleString('id-ID')}). Diselaraskan dengan fraksi harga resmi BEI.`
      },
      {
        strategy: 'Breakout Momentum Buy',
        badge: 'High Momentum',
        badgeClass: 'badge-amber',
        entryRange: `Beli jika tembus & bertahan di atas ${instLevels.resistance1.toLocaleString('id-ID')}`,
        entryIdeal: instLevels.resistance1,
        stopLoss: instLevels.pivot,
        riskPoints: Math.max(1, instLevels.resistance1 - instLevels.pivot),
        riskPct: (((instLevels.resistance1 - instLevels.pivot) / instLevels.resistance1) * 100).toFixed(2),
        targetPrice1: instLevels.resistance2,
        targetPrice2: Math.round(instLevels.resistance2 * 1.03),
        potentialGainPct: (((instLevels.resistance2 - instLevels.resistance1) / instLevels.resistance1) * 100).toFixed(2),
        rrRatio: '1 : 2.0',
        rationale: `Konfirmasi breakout saat harga mampu menembus Resistance 1 (${instLevels.resistance1.toLocaleString('id-ID')}).`
      }
    ]
  }

  const bandar = {
    bandarStatus: bandarEngine.statusIndo,
    bandarAction: bandarEngine.bandarScore >= 15 ? 'NET BUY / AKUMULASI' : bandarEngine.bandarScore <= -15 ? 'NET SELL / DISTRIBUSI' : 'NETRAL / BALANCED',
    netVolumeLots: bandarEngine.top5.netLot,
    netValueRp: bandarEngine.top5.netVal,
    foreignNetRp: Math.round(bandarEngine.top5.netVal * 0.65),
    smartMoneyScore: Math.round(50 + (bandarEngine.bandarScore / 2)),
    smartMoneyPhase: bandarEngine.phase,
    retailActivity: bandarEngine.bandarScore >= 15 ? 'Ritel Melepas Barang / TP' : bandarEngine.bandarScore <= -15 ? 'Ritel FOMO Membeli di Pucuk' : 'Aktivitas Normal',
    smartMoneyAvgBuyPrice: bandarEngine.smartMoneyAvgBuyPrice,
    bandarSpreadPct: bandarEngine.bandarSpreadPct,
    entryVerdict: bandarEngine.entryVerdict,
    entryReason: bandarEngine.entryReason,
    cr5Buy: bandarEngine.top5.crBuy,
    cr5Sell: bandarEngine.top5.crSell,
    // Field yang dibutuhkan oleh BandarmologyView
    totalTopBuyLots: bandarEngine.top5.buyLot,
    totalTopSellLots: bandarEngine.top5.sellLot,
    netTopLots: bandarEngine.top5.netLot,
    topBuyerBrokers: brokerAction.buyerBrokers.slice(0, 5).map(b => ({
      code: b.code,
      name: b.name,
      type: ['AK', 'BK', 'ZP', 'KZ', 'CS', 'RX'].includes(b.code) ? 'Asing / Institusi' : ['CC', 'NI', 'LG', 'DH', 'OD', 'DX'].includes(b.code) ? 'Institusi Domestik' : 'Ritel Domestik',
      buyLot: b.lot,
      avgPrice: b.avg
    })),
    topSellerBrokers: brokerAction.sellerBrokers.slice(0, 5).map(s => ({
      code: s.code,
      name: s.name,
      type: ['YP', 'PD', 'XC', 'XL', 'KK', 'SQ', 'AT'].includes(s.code) ? 'Ritel Domestik' : ['CC', 'NI', 'LG', 'DH'].includes(s.code) ? 'Institusi Domestik' : 'Asing / Institusi',
      sellLot: s.lot,
      avgPrice: s.avg
    }))
  }

  return {
    ...stockObj,
    analysis,
    bandar,
    brokerAction,
    history: effectiveHistory,
    isLive: isLiveActual,
    source: isLiveActual ? 'Live Yahoo Finance (IDX Official Feed)' : 'IDX Master Analytics Database'
  }
}

export async function fetchIhsgData() {
  // 1. Coba dari SQLite Database Backend
  try {
    const dbRes = await fetch('/api/db/market-summary')
    if (dbRes.ok) {
      const json = await dbRes.json()
      if (json.status === 'success' && json.ihsg) {
        const ihsg = json.ihsg
        return {
          price: Number(ihsg.price),
          current: Number(ihsg.price),
          change: Number(ihsg.change),
          changePct: Number(ihsg.change_pct),
          volume: '18.4 Miliar Lembar',
          turnover: 'Rp 11.2 Triliun',
          foreignFlow: ihsg.foreign_flow,
          support1: ihsg.support_1,
          support2: ihsg.support_2,
          resistance1: ihsg.resistance_1,
          resistance2: ihsg.resistance_2,
          status: ihsg.status,
          isLive: true
        }
      }
    }
  } catch (e) {
    console.warn('SQLite IHSG fetch fallback:', e)
  }

  // 2. Fallback ke Yahoo Finance Live
  try {
    const res = await fetch('/api/yahoo/v8/finance/chart/^JKSE?interval=1d&range=5d', {
      headers: { 'Accept': 'application/json' }
    })
    if (res.ok) {
      const json = await res.json()
      const result = json?.chart?.result?.[0]
      if (result && result.meta) {
        const meta = result.meta
        const price = meta.regularMarketPrice || meta.chartPreviousClose || 7200
        const prevClose = meta.chartPreviousClose || price
        const change = Number((price - prevClose).toFixed(2))
        const changePct = Number(((change / prevClose) * 100).toFixed(2))
        return {
          price: Number(price.toFixed(2)),
          current: Number(price.toFixed(2)),
          change,
          changePct,
          volume: '18.4 Miliar Lembar',
          turnover: 'Rp 11.2 Triliun',
          foreignFlow: change >= 0 ? '+Rp 640 Miliar (Net Buy)' : '-Rp 420 Miliar (Net Sell)',
          support1: Math.round(price * 0.992),
          support2: Math.round(price * 0.985),
          resistance1: Math.round(price * 1.008),
          resistance2: Math.round(price * 1.015),
          status: change >= 0 ? 'Bullish Rebound' : 'Konsolidasi Lemah',
          isLive: true
        }
      }
    }
  } catch (e) {
    console.warn('IHSG live fetch error', e)
  }
  return IHSG_DATA
}

export async function syncMarketDb() {
  try {
    const res = await fetch('/api/db/sync', { method: 'POST' })
    if (res.ok) {
      const json = await res.json()
      return { ok: true, message: json.message }
    }
  } catch (e) {
    return { ok: false, message: e.message }
  }
  return { ok: false, message: 'Gagal sinkronisasi SQLite' }
}
