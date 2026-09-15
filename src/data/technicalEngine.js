// Model Kuantitatif Analisis Teknikal & Multi-Indicator Confluence
// Indikator: Trend Moving Average (MA20/50/200), RSI (14), ATR Volatilitas, Pivot S/R

export function calculateTechnicalEngine(history, currentPrice, highPrice, lowPrice) {
  const prices = (history || []).map(h => h.price)
  const n = prices.length

  if (n === 0) {
    return null
  }

  // 1. Moving Averages
  const calcSMA = (period) => {
    if (n < period) return currentPrice
    const slice = prices.slice(n - period)
    const sum = slice.reduce((a, b) => a + b, 0)
    return Math.round(sum / period)
  }

  const ma20 = calcSMA(20)
  const ma50 = calcSMA(50)
  const ma200 = calcSMA(200)

  // 2. Relative Strength Index (RSI 14)
  let rsi = 50
  if (n >= 15) {
    let gains = 0
    let losses = 0
    for (let i = n - 14; i < n; i++) {
      const diff = prices[i] - prices[i - 1]
      if (diff >= 0) gains += diff
      else losses += Math.abs(diff)
    }
    const avgGain = gains / 14
    const avgLoss = losses / 14
    if (avgLoss === 0) {
      rsi = 100
    } else {
      const rs = avgGain / avgLoss
      rsi = Math.round(100 - (100 / (1 + rs)))
    }
  } else {
    // Estimasi awal jika candle belum 14
    rsi = 52
  }

  // 3. Average True Range (ATR 14) untuk Volatilitas & Buffer Stop Loss
  let atr = Math.round(currentPrice * 0.022) // Default 2.2% buffer
  if (n >= 14) {
    let trSum = 0
    for (let i = n - 14; i < n; i++) {
      const h = prices[i] * 1.012
      const l = prices[i] * 0.988
      const prevC = prices[i - 1] || prices[i]
      const tr = Math.max(h - l, Math.abs(h - prevC), Math.abs(l - prevC))
      trSum += tr
    }
    atr = Math.max(1, Math.round(trSum / 14))
  }

  // 4. Pivot Points (Classic Floor Trader Pivot)
  const P = Math.round((highPrice + lowPrice + currentPrice) / 3)
  const S1 = Math.round(2 * P - highPrice)
  const S2 = Math.round(P - (highPrice - lowPrice))
  const S3 = Math.round(lowPrice - 2 * (highPrice - P))
  const R1 = Math.round(2 * P - lowPrice)
  const R2 = Math.round(P + (highPrice - lowPrice))
  const R3 = Math.round(highPrice + 2 * (P - lowPrice))

  // 5. Presisi Dynamic Entry & Exit Zones
  const entryLow = Math.max(1, Math.round(S1 - (atr * 0.3)))
  const entryHigh = Math.round(S1 + (atr * 0.2))
  const stopLoss = Math.max(1, Math.round(S2 - (atr * 0.5)))
  const takeProfit1 = R1
  const takeProfit2 = R2

  const risk = Math.max(1, entryHigh - stopLoss)
  const reward = Math.max(1, takeProfit1 - entryHigh)
  const rrr = (reward / risk).toFixed(1)

  // 6. Evaluasi Status Tren & Sinyal Konfluensi
  let trendStatus = 'Neutral Sideways'
  let trendColor = '#94A3B8'
  let maScore = 0

  if (currentPrice > ma20 && ma20 > ma50) {
    trendStatus = 'Strong Uptrend (Bullish Alignment)'
    trendColor = '#10B981'
    maScore = 35
  } else if (currentPrice > ma20 && currentPrice <= ma50) {
    trendStatus = 'Pullback in Secondary Trend'
    trendColor = '#38BDF8'
    maScore = 20
  } else if (currentPrice < ma20 && currentPrice > ma50) {
    trendStatus = 'Corrective Retest MA50'
    trendColor = '#F59E0B'
    maScore = 15
  } else {
    trendStatus = 'Downtrend (Bearish Alignment)'
    trendColor = '#EF4444'
    maScore = 0
  }

  // RSI Signal
  let rsiSignal = 'Neutral'
  let rsiScore = 0
  if (rsi <= 35) {
    rsiSignal = 'Oversold (Potensi Rebound Tinggi)'
    rsiScore = 35
  } else if (rsi > 35 && rsi <= 55) {
    rsiSignal = 'Healthy Accumulation Zone'
    rsiScore = 30
  } else if (rsi > 55 && rsi <= 70) {
    rsiSignal = 'Bullish Momentum'
    rsiScore = 25
  } else {
    rsiSignal = 'Overbought (Rawan Koreksi/Jenuh Beli)'
    rsiScore = 5
  }

  // Confluence Total Score (0 - 100)
  const totalTechnicalScore = Math.min(100, maScore + rsiScore + (Number(rrr) >= 2.0 ? 30 : 15))

  return {
    ma20,
    ma50,
    ma200,
    rsi,
    rsiSignal,
    atr,
    pivot: P,
    support1: S1,
    support2: S2,
    support3: S3,
    resistance1: R1,
    resistance2: R2,
    resistance3: R3,
    entryLow,
    entryHigh,
    stopLoss,
    takeProfit1,
    takeProfit2,
    riskPoints: risk,
    rewardPoints: reward,
    riskRewardRatio: `1 : ${rrr}`,
    trendStatus,
    trendColor,
    totalTechnicalScore
  }
}
