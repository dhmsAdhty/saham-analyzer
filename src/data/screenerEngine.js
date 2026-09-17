// Screening Engine untuk Saham Berpotensi Terbang (High Probability Breakout & Big Acc)
// Memindai saham berbasis SQLite Database terintegrasi & Live Market Bursa

import { IDX_FULL_EMITEN } from './emitenUniverse.js'
import { generateStockbitBrokerAction } from './brokerAction.js'
import { calculateBandarmologyEngine } from './bandarmologyEngine.js'
import { calculateTechnicalEngine } from './technicalEngine.js'
import { calculateInstitutionalTradeLevels } from './institutionalTradeEngine.js'

export async function runStockScreener(filterType = 'all') {
  let sourceStocks = IDX_FULL_EMITEN

  // 1. Prioritaskan ambil data langsung dari SQLite Database Backend
  try {
    const res = await fetch('/api/db/stocks')
    if (res.ok) {
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        sourceStocks = json.data.map(d => ({
          ticker: d.ticker,
          name: d.name,
          group: d.group_name,
          sector: d.sector,
          subsector: d.subsector,
          price: d.price,
          change: d.change,
          changePct: d.change_pct,
          peRatio: d.pe_ratio,
          pbv: d.pbv,
          pbvMean: d.pbv_mean,
          bvps: d.bvps,
          roe: d.roe,
          der: d.der,
          dividendYield: d.dividend_yield,
          freeFloatPct: d.free_float_pct,
          freeFloatCategory: d.free_float_category,
          about: d.about,
          history7d: [
            { date: '11 Sep', price: Math.round(d.price * 0.97) },
            { date: '12 Sep', price: Math.round(d.price * 0.98) },
            { date: '15 Sep', price: Math.round(d.price * 0.99) },
            { date: '16 Sep', price: Math.round(d.price * (d.change_pct >= 0 ? 0.98 : 1.02)) },
            { date: '17 Sep', price: d.price }
          ]
        }))
      }
    }
  } catch (e) {
    console.warn('SQLite stocks fetch failed, falling back to universe catalog', e)
  }

  const results = []

  for (const stock of sourceStocks) {
    const effectivePrice = stock.price || 1000
    const brokerAction = generateStockbitBrokerAction(stock)
    const bandar = calculateBandarmologyEngine(stock, brokerAction)
    const history = stock.history7d || []
    const high = Math.round(effectivePrice * 1.02)
    const low = Math.round(effectivePrice * 0.98)
    const tech = calculateTechnicalEngine(history, effectivePrice, high, low)
    const inst = calculateInstitutionalTradeLevels(history, effectivePrice, bandar.smartMoneyAvgBuyPrice, bandar.status)

    // Skor Potensi Terbang (Fly Potential Score 0 - 100)
    // 45% Bandarmologi + 35% Modal Proximity + 20% Teknikal Confluence
    const bandarScoreNorm = Math.max(0, Math.min(100, (bandar.bandarScore + 100) / 2))
    const spreadPct = Number(bandar.bandarSpreadPct)
    let proximityScore = 50
    if (spreadPct >= -3 && spreadPct <= 2.5) {
      proximityScore = 95 // Pas di modal bandar, resiko minim
    } else if (spreadPct > 2.5 && spreadPct <= 6) {
      proximityScore = 75 // Momentum terbang
    } else if (spreadPct < -3) {
      proximityScore = 30
    } else {
      proximityScore = 20
    }

    const flyScore = Math.round((bandarScoreNorm * 0.45) + (proximityScore * 0.35) + ((tech?.totalTechnicalScore || 50) * 0.20))

    // Tag Kategori Potensi
    let category = 'Konsolidasi'
    let categoryBadge = 'badge-neutral'
    let catalystBadge = 'Katalis Normal'
    let isTopPick = false

    if (flyScore >= 75 && bandar.bandarScore >= 20) {
      category = 'SIAP TERBANG (Big Acc & Rebound)'
      categoryBadge = 'badge-flying'
      isTopPick = true
      catalystBadge = 'Akumulasi Masif + Katalis Solid'
    } else if (flyScore >= 60) {
      category = 'AKUMULASI SENYAP (Base Building)'
      categoryBadge = 'badge-acc'
      catalystBadge = 'Arus Inflow Institusi'
    } else if (bandar.bandarScore < -15) {
      category = 'DISTRIBUSI (Hati-hati Trap)'
      categoryBadge = 'badge-danger'
      catalystBadge = 'Tekanan Jual Rawan Guyur'
    }

    const item = {
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      price: effectivePrice,
      changePct: stock.changePct !== undefined ? stock.changePct : (stock.change_pct || 0),
      flyScore,
      category,
      categoryBadge,
      catalystBadge,
      isTopPick,
      bandarStatus: bandar.statusIndo,
      bandarScore: bandar.bandarScore,
      smartMoneyAvgBuyPrice: bandar.smartMoneyAvgBuyPrice,
      spreadPct: bandar.bandarSpreadPct,
      top1Buyer: brokerAction.buyerBrokers[0]?.code || 'AK',
      top1BuyerVal: brokerAction.buyerBrokers[0]?.val || 0,
      entryLow: inst.entryBuyLow,
      entryHigh: inst.entryBuyHigh,
      tp1: inst.takeProfit1,
      tp2: inst.takeProfit2,
      sl: inst.stopLoss,
      rrr: inst.riskRewardRatio,
      group: stock.group || stock.group_name || 'Umum',
      keyCatalyst: stock.catalysts?.[0] || stock.about || 'Aktivitas akumulasi smart money.',
      newsSummary: stock.recentNews?.[0]?.title || 'Pergerakan pasar modal aktif.'
    }

    results.push(item)
  }

  // Urutkan saham dari skor potensi terbang tertinggi
  results.sort((a, b) => b.flyScore - a.flyScore)

  // Filter Kategori Konglomerasi & Potensi Terbang
  if (filterType === 'ready_to_fly') {
    return results.filter(r => r.flyScore >= 70 && r.bandarScore > 0)
  } else if (filterType === 'prajogo') {
    return results.filter(r => ['BREN', 'BRPT', 'CUAN', 'PTRO', 'TPIA'].includes(r.ticker))
  } else if (filterType === 'hapsoro') {
    return results.filter(r => ['RAJA', 'FORU', 'MINA', 'PSAB'].includes(r.ticker))
  } else if (filterType === 'bakrie_salim') {
    return results.filter(r => ['BRMS', 'BUMI', 'AMMN', 'ICBP', 'INDF'].includes(r.ticker))
  } else if (filterType === 'silent_acc') {
    return results.filter(r => r.bandarScore >= 15 && Number(r.spreadPct) <= 2.5)
  } else if (filterType === 'big_caps') {
    return results.filter(r => ['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII', 'ICBP', 'ADRO', 'BREN', 'BBNI'].includes(r.ticker))
  }

  return results
}
