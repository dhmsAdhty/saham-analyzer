// Generator data bandarmologi, broker summary, dan smart money
export function generateBandarData(stock) {
  const price = stock.price
  const isUp = stock.changePct >= 0
  const isStrong = Math.abs(stock.changePct) > 1.5

  // Tentukan status bandar berdasarkan karakter saham & pergerakan
  let bandarStatus = 'Akumulasi Normal'
  let bandarAction = 'NET BUY'
  let netVolumeLots = 0
  let netValueRp = 0
  let topBuyerBrokers = []
  let topSellerBrokers = []
  let smartMoneyScore = 65 // 0-100
  let smartMoneyPhase = 'Akumulasi Bertahap'
  let foreignNetRp = 0
  let retailActivity = 'Net Sell (Distribusi Ritel)'

  // Broker codes standard IDX
  // Institusi/Asing: ZP (Maybank), AK (UBS), BK (J.P. Morgan), CS (Credit Suisse), KZ (CLSA), RX (Macquarie), CC (Mandiri Sekuritas), NI (BNI Sekuritas), LG (Trimegah)
  // Ritel: YP (Mirae Asset), PD (Indo Premier), CC (Ritel part), XC (Ajaib), XL (Stockbit), KK (Phillip)
  
  if (stock.ticker === 'BBCA') {
    bandarStatus = 'Big Accumulation'
    bandarAction = 'NET BUY BESAR'
    netVolumeLots = 185420
    netValueRp = 185420 * 100 * price
    foreignNetRp = 142500000000 // +142.5 Miliar
    smartMoneyScore = 88
    smartMoneyPhase = 'Markup / Akumulasi Aktif'
    retailActivity = 'Ritel Melakukan Profit Taking'
    topBuyerBrokers = [
      { code: 'AK', name: 'UBS Sekuritas', type: 'Asing / Institusi', buyLot: 124500, avgPrice: 10225 },
      { code: 'ZP', name: 'Maybank Sekuritas', type: 'Asing / Institusi', buyLot: 98200, avgPrice: 10210 },
      { code: 'BK', name: 'J.P. Morgan', type: 'Asing / Institusi', buyLot: 85600, avgPrice: 10240 },
      { code: 'CC', name: 'Mandiri Sekuritas', type: 'Institusi Domestik', buyLot: 62400, avgPrice: 10200 },
      { code: 'KZ', name: 'CLSA Sekuritas', type: 'Asing / Institusi', buyLot: 48900, avgPrice: 10230 }
    ]
    topSellerBrokers = [
      { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Ritel Domestik', sellLot: 112000, avgPrice: 10245 },
      { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Ritel Domestik', sellLot: 89400, avgPrice: 10235 },
      { code: 'XC', name: 'Ajaib Sekuritas', type: 'Ritel Domestik', sellLot: 64500, avgPrice: 10220 },
      { code: 'XL', name: 'Stockbit Sekuritas', type: 'Ritel Domestik', sellLot: 42100, avgPrice: 10250 },
      { code: 'NI', name: 'BNI Sekuritas', type: 'Institusi Domestik', sellLot: 25600, avgPrice: 10215 }
    ]
  } else if (stock.ticker === 'BBRI') {
    bandarStatus = 'Akumulasi di Area Support'
    bandarAction = 'NET BUY MODERAT'
    netVolumeLots = 142100
    netValueRp = 142100 * 100 * price
    foreignNetRp = 68200000000 // +68.2 M
    smartMoneyScore = 78
    smartMoneyPhase = 'Bottom Fishing / Akumulasi Senyap'
    retailActivity = 'Ritel Cut Loss / Panik Jual'
    topBuyerBrokers = [
      { code: 'BK', name: 'J.P. Morgan', type: 'Asing / Institusi', buyLot: 110400, avgPrice: 4970 },
      { code: 'CS', name: 'Credit Suisse', type: 'Asing / Institusi', buyLot: 88200, avgPrice: 4965 },
      { code: 'CC', name: 'Mandiri Sekuritas', type: 'Institusi Domestik', buyLot: 75100, avgPrice: 4980 },
      { code: 'RX', name: 'Macquarie', type: 'Asing / Institusi', buyLot: 54000, avgPrice: 4960 },
      { code: 'LG', name: 'Trimegah Sekuritas', type: 'Institusi Domestik', buyLot: 42000, avgPrice: 4975 }
    ]
    topSellerBrokers = [
      { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Ritel Domestik', sellLot: 125000, avgPrice: 4990 },
      { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Ritel Domestik', sellLot: 94500, avgPrice: 4985 },
      { code: 'XC', name: 'Ajaib Sekuritas', type: 'Ritel Domestik', sellLot: 52000, avgPrice: 4970 },
      { code: 'KK', name: 'Phillip Sekuritas', type: 'Ritel Domestik', sellLot: 38900, avgPrice: 4980 },
      { code: 'XL', name: 'Stockbit Sekuritas', type: 'Ritel Domestik', sellLot: 28100, avgPrice: 4975 }
    ]
  } else if (stock.ticker === 'BREN') {
    bandarStatus = 'Distribusi Ringan (Tight Float)'
    bandarAction = 'NET SELL'
    netVolumeLots = -34200
    netValueRp = -34200 * 100 * price
    foreignNetRp = -24500000000 // -24.5 M
    smartMoneyScore = 42
    smartMoneyPhase = 'Distribusi Bertahap / Profit Taking'
    retailActivity = 'Ritel Menampung di Pucuk (FOMO)'
    topBuyerBrokers = [
      { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Ritel Domestik', buyLot: 45200, avgPrice: 6225 },
      { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Ritel Domestik', buyLot: 38100, avgPrice: 6200 },
      { code: 'XC', name: 'Ajaib Sekuritas', type: 'Ritel Domestik', buyLot: 29400, avgPrice: 6175 },
      { code: 'XL', name: 'Stockbit Sekuritas', type: 'Ritel Domestik', buyLot: 18500, avgPrice: 6150 },
      { code: 'CC', name: 'Mandiri Sekuritas', type: 'Campuran', buyLot: 12000, avgPrice: 6180 }
    ]
    topSellerBrokers = [
      { code: 'AK', name: 'UBS Sekuritas', type: 'Asing / Institusi', sellLot: 58000, avgPrice: 6250 },
      { code: 'ZP', name: 'Maybank Sekuritas', type: 'Asing / Institusi', sellLot: 46200, avgPrice: 6230 },
      { code: 'BK', name: 'J.P. Morgan', type: 'Asing / Institusi', sellLot: 32400, avgPrice: 6210 },
      { code: 'LG', name: 'Trimegah Sekuritas', type: 'Institusi Domestik', sellLot: 21000, avgPrice: 6200 },
      { code: 'NI', name: 'BNI Sekuritas', type: 'Institusi Domestik', sellLot: 19500, avgPrice: 6190 }
    ]
  } else if (stock.ticker === 'GOTO') {
    bandarStatus = 'Akumulasi Konsolidasi'
    bandarAction = 'NET BUY BESAR'
    netVolumeLots = 1450000
    netValueRp = 1450000 * 100 * price
    foreignNetRp = 38500000000 // +38.5 M
    smartMoneyScore = 72
    smartMoneyPhase = 'Akumulasi di Bottom (Base Building)'
    retailActivity = 'Ritel Putus Asa / Jual Rugi'
    topBuyerBrokers = [
      { code: 'AK', name: 'UBS Sekuritas', type: 'Asing / Institusi', buyLot: 680000, avgPrice: 53.5 },
      { code: 'CS', name: 'Credit Suisse', type: 'Asing / Institusi', buyLot: 520000, avgPrice: 53.8 },
      { code: 'BK', name: 'J.P. Morgan', type: 'Asing / Institusi', buyLot: 440000, avgPrice: 54.0 },
      { code: 'ZP', name: 'Maybank Sekuritas', type: 'Asing / Institusi', buyLot: 310000, avgPrice: 53.2 },
      { code: 'CC', name: 'Mandiri Sekuritas', type: 'Institusi Domestik', buyLot: 250000, avgPrice: 54.0 }
    ]
    topSellerBrokers = [
      { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Ritel Domestik', sellLot: 850000, avgPrice: 54.0 },
      { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Ritel Domestik', sellLot: 720000, avgPrice: 53.9 },
      { code: 'XC', name: 'Ajaib Sekuritas', type: 'Ritel Domestik', sellLot: 410000, avgPrice: 54.1 },
      { code: 'XL', name: 'Stockbit Sekuritas', type: 'Ritel Domestik', sellLot: 330000, avgPrice: 54.0 },
      { code: 'KK', name: 'Phillip Sekuritas', type: 'Ritel Domestik', sellLot: 190000, avgPrice: 53.8 }
    ]
  } else if (stock.ticker === 'JGLE') {
    // SINKRONISASI LENGKAP DENGAN BROKER ACTION SCREENSHOT JGLE
    bandarStatus = 'Distribusi Tersembunyi (Dist)'
    bandarAction = 'NET SELL / DISTRIBUSI'
    netVolumeLots = -118000 // Net distribusi di balik lonjakan harga
    netValueRp = -873200000 // -873 Juta
    foreignNetRp = -1420000000
    smartMoneyScore = 38 // Zona Bearish / Distribusi (sesuai bar ungu di Dist)
    smartMoneyPhase = 'Distribusi di Pucuk / Jual ke Ritel'
    retailActivity = 'Ritel FOMO Membeli di Harga Tinggi'
    topBuyerBrokers = [
      { code: 'AK', name: 'UBS Sekuritas Indonesia', type: 'Asing / Institusi', buyLot: 596000, avgPrice: 73 },
      { code: 'DH', name: 'Sinarmas Sekuritas', type: 'Institusi Domestik', buyLot: 27600, avgPrice: 74 },
      { code: 'NI', name: 'BNI Sekuritas', type: 'Institusi Domestik', buyLot: 26100, avgPrice: 73 },
      { code: 'BK', name: 'J.P. Morgan Sekuritas', type: 'Asing / Institusi', buyLot: 26100, avgPrice: 73 },
      { code: 'GR', name: 'Panin Sekuritas', type: 'Institusi Domestik', buyLot: 19300, avgPrice: 74 }
    ]
    topSellerBrokers = [
      { code: 'XL', name: 'Stockbit Sekuritas', type: 'Ritel / Campuran', sellLot: 391100, avgPrice: 73 },
      { code: 'SQ', name: 'BCA Sekuritas', type: 'Campuran', sellLot: 74100, avgPrice: 74 },
      { code: 'CC', name: 'Mandiri Sekuritas', type: 'Campuran', sellLot: 48200, avgPrice: 73 },
      { code: 'KK', name: 'Phillip Sekuritas', type: 'Ritel Domestik', sellLot: 39400, avgPrice: 73 },
      { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Ritel Domestik', sellLot: 39900, avgPrice: 74 }
    ]
  } else {
    // Dynamic generator untuk saham lainnya
    const isNetBuy = isUp || stock.peRatio < 15
    const baseLot = Math.floor(Math.random() * 50000 + 25000)
    netVolumeLots = isNetBuy ? baseLot : -baseLot
    netValueRp = netVolumeLots * 100 * price
    foreignNetRp = isNetBuy ? Math.round(netValueRp * 0.65) : Math.round(netValueRp * 0.75)
    smartMoneyScore = isNetBuy ? Math.floor(Math.random() * 25 + 68) : Math.floor(Math.random() * 25 + 32)
    bandarStatus = isNetBuy ? 'Akumulasi Konsisten' : 'Distribusi Terbatas'
    bandarAction = isNetBuy ? 'NET BUY' : 'NET SELL'
    smartMoneyPhase = isNetBuy ? 'Markup / Akumulasi Aktif' : 'Distribusi / Realisasi Keuntungan'
    retailActivity = isNetBuy ? 'Ritel Net Sell (Barang diserap Smart Money)' : 'Ritel Net Buy (Menampung barang keluar)'

    const buyBrokersList = isNetBuy ? ['AK', 'ZP', 'BK', 'CC', 'KZ'] : ['YP', 'PD', 'XC', 'XL', 'KK']
    const sellBrokersList = isNetBuy ? ['YP', 'PD', 'XC', 'XL', 'KK'] : ['AK', 'ZP', 'BK', 'CC', 'KZ']
    const names = {
      AK: 'UBS Sekuritas', ZP: 'Maybank Sekuritas', BK: 'J.P. Morgan', CC: 'Mandiri Sekuritas', KZ: 'CLSA Sekuritas',
      YP: 'Mirae Asset Sekuritas', PD: 'Indo Premier Sekuritas', XC: 'Ajaib Sekuritas', XL: 'Stockbit Sekuritas', KK: 'Phillip Sekuritas'
    }

    topBuyerBrokers = buyBrokersList.map((code, i) => ({
      code,
      name: names[code],
      type: ['AK', 'ZP', 'BK', 'KZ'].includes(code) ? 'Asing / Institusi' : 'Ritel Domestik',
      buyLot: Math.round(baseLot * (1.2 - i * 0.18)),
      avgPrice: Math.round(price * (1 + (Math.random() * 0.01 - 0.005)))
    }))

    topSellerBrokers = sellBrokersList.map((code, i) => ({
      code,
      name: names[code],
      type: ['AK', 'ZP', 'BK', 'KZ'].includes(code) ? 'Asing / Institusi' : 'Ritel Domestik',
      sellLot: Math.round(baseLot * (1.1 - i * 0.16)),
      avgPrice: Math.round(price * (1 + (Math.random() * 0.01 - 0.005)))
    }))
  }

  // Hitung total buy volume & sell volume dari top 5 brokers
  const totalTopBuyLots = topBuyerBrokers.reduce((s, b) => s + b.buyLot, 0)
  const totalTopSellLots = topSellerBrokers.reduce((s, b) => s + b.sellLot, 0)
  const netTopLots = totalTopBuyLots - totalTopSellLots
  const bandarVolumeRatio = (totalTopBuyLots / (totalTopSellLots || 1)).toFixed(2)

  // Indikator Entry Signals
  // 1. VWAP (Volume Weighted Average Price) Smart Money
  const smartMoneyAvgBuyPrice = Math.round(
    topBuyerBrokers.reduce((s, b) => s + b.buyLot * b.avgPrice, 0) / (totalTopBuyLots || 1)
  )

  // 2. Bandarmology Confluence Score (0 - 100)
  // Bobot: Smart Money Score (40%), Net Value (30%), Harga vs Bandar VWAP (30%)
  const isNearBandarAvg = Math.abs(price - smartMoneyAvgBuyPrice) / smartMoneyAvgBuyPrice < 0.03
  let entrySignal = 'HOLD / WAIT'
  let entrySignalColor = '#F59E0B'
  let entrySignalDesc = 'Tunggu sinyal konfirmasi breakout atau pantulan di area support bandar.'

  if (smartMoneyScore >= 75 && netVolumeLots > 0) {
    if (price <= smartMoneyAvgBuyPrice * 1.02) {
      entrySignal = 'STRONG ACCUMULATION BUY (ENTRY SANGAT BAGUS)'
      entrySignalColor = '#10B981'
      entrySignalDesc = `Harga saat ini (Rp ${price.toLocaleString('id-ID')}) berada sangat dekat dengan harga rata-rata modal beli Bandar/Smart Money (Rp ${smartMoneyAvgBuyPrice.toLocaleString('id-ID')}). Tingkat risiko sangat rendah!`
    } else {
      entrySignal = 'BUY ON WEAKNESS (Tunggu pullback ke modal bandar)'
      entrySignalColor = '#34D399'
      entrySignalDesc = `Smart money akumulasi masif, namun harga sudah naik sedikit di atas harga beli rata-rata bandar (Rp ${smartMoneyAvgBuyPrice.toLocaleString('id-ID')}). Tunggu koreksi tipis (pullback).`
    }
  } else if (smartMoneyScore <= 45 || netVolumeLots < 0) {
    entrySignal = 'AVOID / TAKE PROFIT (Hati-hati Distribusi)'
    entrySignalColor = '#EF4444'
    entrySignalDesc = `Terjadi aksi distribusi bersih oleh broker institusi/asing. Hindari melakukan entry baru sampai tekanan jual mereda.`
  }

  return {
    bandarStatus,
    bandarAction,
    netVolumeLots,
    netValueRp,
    foreignNetRp,
    smartMoneyScore,
    smartMoneyPhase,
    retailActivity,
    topBuyerBrokers,
    topSellerBrokers,
    totalTopBuyLots,
    totalTopSellLots,
    netTopLots,
    bandarVolumeRatio,
    smartMoneyAvgBuyPrice,
    entrySignal,
    entrySignalColor,
    entrySignalDesc,
  }
}
