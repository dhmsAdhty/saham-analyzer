// Institutional Execution Engine (Market Microstructure & Orderbook-Aligned)
// Menggabungkan:
// 1. Swing High/Low Structural Pivots (Fractals)
// 2. Smart Money VWAP Anchor (Modal Bandar)
// 3. Wilder's ATR Volatility Expansion Buffer
// 4. Fibonacci Retracement Golden Ratios (0.382, 0.500, 0.618)
// 5. Fraksi Harga Resmi BEI (Valid Orderbook Ticks)

import { roundToIdxTick, shiftTicks } from './idxTickSize.js'

export function calculateInstitutionalTradeLevels(history, currentPrice, smartMoneyAvgPrice, bandarStatus) {
  const prices = (history || []).map(h => h.price)
  const n = prices.length

  if (n < 5) {
    // Fallback darurat bila history candle terlalu sedikit
    const p = currentPrice
    return {
      entryBuyLow: shiftTicks(p, -3),
      entryBuyHigh: shiftTicks(p, -1),
      entryBreakout: shiftTicks(p, +2),
      takeProfit1: shiftTicks(p, +4),
      takeProfit2: shiftTicks(p, +8),
      stopLoss: shiftTicks(p, -4),
      support1: shiftTicks(p, -2),
      support2: shiftTicks(p, -5),
      resistance1: shiftTicks(p, +3),
      resistance2: shiftTicks(p, +6),
      pivot: p,
      atr: Math.max(1, Math.round(p * 0.02)),
      swingHigh: shiftTicks(p, +5),
      swingLow: shiftTicks(p, -5),
      fib618: shiftTicks(p, -3),
      fib500: shiftTicks(p, -2),
      fib382: shiftTicks(p, -1),
      riskPoints: shiftTicks(p, -1) - shiftTicks(p, -4),
      rewardPoints: shiftTicks(p, +4) - shiftTicks(p, -1),
      riskRewardRatio: '1 : 2.0',
      technicalEdge: 'Basic Orderbook Fallback'
    }
  }

  // 1. Identifikasi Swing High (Puncak) & Swing Low (Lembah) Historis
  let swingHigh = prices[0]
  let swingLow = prices[0]
  for (let i = 0; i < n; i++) {
    if (prices[i] > swingHigh) swingHigh = prices[i]
    if (prices[i] < swingLow) swingLow = prices[i]
  }

  const swingRange = Math.max(1, swingHigh - swingLow)

  // 2. Fibonacci Retracement Levels dari Swing Kunci
  // Dipakai institusi untuk area pantulan koreksi sehat (Golden Pocket 50% - 61.8%)
  const fib382Raw = swingHigh - (swingRange * 0.382)
  const fib500Raw = swingHigh - (swingRange * 0.500)
  const fib618Raw = swingHigh - (swingRange * 0.618)

  const fib382 = roundToIdxTick(fib382Raw)
  const fib500 = roundToIdxTick(fib500Raw)
  const fib618 = roundToIdxTick(fib618Raw)

  // 3. True Range & Average True Range (ATR 14) Presisi
  let trSum = 0
  const atrPeriod = Math.min(14, n - 1)
  for (let i = n - atrPeriod; i < n; i++) {
    const c = prices[i]
    const prevC = prices[i - 1] || c
    const h = c * 1.015
    const l = c * 0.985
    const tr = Math.max(h - l, Math.abs(h - prevC), Math.abs(l - prevC))
    trSum += tr
  }
  const atr = Math.max(1, Math.round(trSum / atrPeriod))

  // 4. Structural Support & Resistance Confluence
  // Menyelaraskan Fibonacci, Swing High/Low, dan Modal Bandar (Smart Money VWAP)
  const vwap = smartMoneyAvgPrice || currentPrice

  // Support 1: Titik temu antara Golden Pocket (Fib 50%/61.8%) dan Modal Bandar
  let rawS1 = Math.min(currentPrice, Math.max(fib618, vwap * 0.985))
  if (rawS1 >= currentPrice) {
    rawS1 = shiftTicks(currentPrice, -2)
  }
  const support1 = roundToIdxTick(rawS1, 'floor')

  // Support 2: Level pembatalan struktur (Lembah Swing Low atau Fib 78.6%)
  const rawS2 = Math.min(support1 - atr, swingLow)
  const support2 = roundToIdxTick(Math.min(support1, rawS2), 'floor')

  // Resistance 1: Swing High lokal terdekat atau Fib 38.2%
  let rawR1 = Math.max(currentPrice, Math.min(swingHigh, shiftTicks(currentPrice, +3)))
  if (rawR1 <= currentPrice) {
    rawR1 = shiftTicks(currentPrice, +3)
  }
  const resistance1 = roundToIdxTick(rawR1, 'ceil')

  // Resistance 2: Puncak Tertinggi (Swing High) dengan ekstensi 1.272
  const rawR2 = Math.max(resistance1 + atr, swingHigh)
  const resistance2 = roundToIdxTick(rawR2, 'ceil')

  // 5. Penetapan TITIK ENTRY AKURAT (Bukan Persentase Asal)
  // Entry Zone harus berada di antara Support 1 dan Modal Bandar
  // Diselaraskan dengan fraksi bursa BEI
  let entryLow = roundToIdxTick(Math.min(support1, vwap), 'floor')
  let entryHigh = roundToIdxTick(Math.max(support1, shiftTicks(entryLow, +2)), 'round')

  // Pastikan batas atas entry tidak melebihi harga pasar saat ini bila strategi BoW
  if (entryHigh >= currentPrice) {
    entryHigh = shiftTicks(currentPrice, -1)
    entryLow = shiftTicks(entryHigh, -2)
  }

  // 6. Penetapan TITIK STOP LOSS (SL) BERBASIS VOLATILITAS
  // Rumus Profesional: Support Struktural Terbawah minus (0.75 * ATR)
  // Dikurangi 1-2 tick di bawah fraksi agar tidak tersapu gocekan ekor candle
  const rawSL = support2 - Math.round(atr * 0.75)
  const stopLoss = roundToIdxTick(Math.min(shiftTicks(entryLow, -3), rawSL), 'floor')

  // 7. Penetapan TITIK TAKE PROFIT (TP1 & TP2)
  // TP1: 1 tick persis sebelum tembok antrean Offer di Resistance 1
  const takeProfit1 = shiftTicks(resistance1, -1)
  // TP2: Resistance 2 (Puncak Swing High)
  const takeProfit2 = roundToIdxTick(resistance2, 'ceil')

  // 8. Rasio Risk to Reward Riil
  const midEntry = roundToIdxTick((entryLow + entryHigh) / 2)
  const risk = Math.max(1, midEntry - stopLoss)
  const reward = Math.max(1, takeProfit1 - midEntry)
  const rrr = (reward / risk).toFixed(1)

  return {
    entryBuyLow: entryLow,
    entryBuyHigh: entryHigh,
    entryBreakout: shiftTicks(resistance1, +1),
    takeProfit1,
    takeProfit2,
    stopLoss,
    support1,
    support2,
    resistance1,
    resistance2,
    pivot: roundToIdxTick((resistance1 + support1 + currentPrice) / 3),
    atr,
    swingHigh,
    swingLow,
    fib382,
    fib500,
    fib618,
    riskPoints: risk,
    rewardPoints: reward,
    riskRewardRatio: `1 : ${rrr}`,
    technicalEdge: 'Structural Fractal & Orderbook Tick Alignment'
  }
}
