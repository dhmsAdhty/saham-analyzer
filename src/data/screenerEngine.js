// Screening Engine untuk Saham Berpotensi Terbang (High Probability Breakout & Big Acc)
// Memindai saham berbasis:
// 1. Smart Money / Bandarmologi (Big Accumulation & Akumulasi Senyap)
// 2. Proximity ke Modal Bandar (VWAP)
// 3. Sentimen Isu Berita Positif
// 4. Struktur Teknikal Rebound & Breakout Momentum

import { IDX_FULL_EMITEN } from './emitenUniverse.js'
import { generateStockbitBrokerAction } from './brokerAction.js'
import { calculateBandarmologyEngine } from './bandarmologyEngine.js'
import { calculateTechnicalEngine } from './technicalEngine.js'
import { calculateInstitutionalTradeLevels } from './institutionalTradeEngine.js'
import { fetchLiveBatchQuotes } from '../services/liveQuoteBatch.js'

export async function runStockScreener(filterType = 'all') {
  const results = []

  // 1. Ambil harga live terkini dari bursa untuk semua emiten
  const tickers = IDX_FULL_EMITEN.map(s => s.ticker)
  let liveQuotes = {}
  try {
    liveQuotes = await fetchLiveBatchQuotes(tickers)
  } catch (e) {
    console.warn('Batch live quotes failed, using master universe data', e)
  }

  for (const stock of IDX_FULL_EMITEN) {
    const live = liveQuotes[stock.ticker]
    const effectivePrice = live?.price || stock.price
    const effectiveChange = live ? live.change : stock.change
    const effectiveChangePct = live ? live.changePct : stock.changePct

    const liveStockObj = {
      ...stock,
      price: effectivePrice,
      change: effectiveChange,
      changePct: effectiveChangePct
    }

    const brokerAction = generateStockbitBrokerAction(liveStockObj)
    const bandar = calculateBandarmologyEngine(liveStockObj, brokerAction)
    const history = live?.history || stock.history7d || []
    const high = Math.round(effectivePrice * 1.02)
    const low = Math.round(effectivePrice * 0.98)
    const tech = calculateTechnicalEngine(history, effectivePrice, high, low)
    const inst = calculateInstitutionalTradeLevels(history, effectivePrice, bandar.smartMoneyAvgBuyPrice, bandar.status)

    // Skor Potensi Terbang (Fly Potential Score 0 - 100)
    // 40% Bandarmologi + 30% Modal Proximity + 30% Teknikal Confluence
    const bandarScoreNorm = Math.max(0, Math.min(100, (bandar.bandarScore + 100) / 2))
    const spreadPct = Number(bandar.bandarSpreadPct)
    let proximityScore = 50
    if (spreadPct >= -3 && spreadPct <= 2.5) {
      proximityScore = 95 // Pas di modal bandar, resiko minim
    } else if (spreadPct > 2.5 && spreadPct <= 6) {
      proximityScore = 75 // Momentum terbang
    } else if (spreadPct < -3) {
      proximityScore = 30 // Diskon tapi rawan markdown
    } else {
      proximityScore = 20 // Sudah terbang terlalu jauh, rawan guyur
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
      price: stock.price,
      changePct: stock.changePct,
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
      group: stock.group || 'Umum',
      keyCatalyst: stock.catalysts?.[0] || 'Aktivitas akumulasi smart money.',
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
    return results.filter(r => ['BRMS', 'BUMI', 'AMMN', 'ICBP'].includes(r.ticker))
  } else if (filterType === 'silent_acc') {
    return results.filter(r => r.bandarScore >= 15 && Number(r.spreadPct) <= 2.5)
  } else if (filterType === 'big_caps') {
    return results.filter(r => ['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII', 'ICBP', 'ADRO', 'BREN'].includes(r.ticker))
  }

  return results
}
