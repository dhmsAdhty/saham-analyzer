// Algoritma Ilmiah Bandarmologi, Volume Concentration & Wyckoff Phase Engine
// Berdasarkan Standar Broker Summary BEI & Stockbit Bandar Detector Formula

export function calculateBandarmologyEngine(stock, brokerData) {
  const buyers = brokerData?.buyerBrokers || []
  const sellers = brokerData?.sellerBrokers || []

  // 1. Hitung Net Volume dan Net Value per Broker
  // Satuan: lot dan IDR
  const top1BuyLot = buyers[0]?.lot || 0
  const top1SellLot = sellers[0]?.lot || 0
  const top3BuyLot = buyers.slice(0, 3).reduce((s, b) => s + b.lot, 0)
  const top3SellLot = sellers.slice(0, 3).reduce((s, b) => s + b.lot, 0)
  const top5BuyLot = buyers.slice(0, 5).reduce((s, b) => s + b.lot, 0)
  const top5SellLot = sellers.slice(0, 5).reduce((s, b) => s + b.lot, 0)

  const top1BuyVal = buyers[0]?.val || 0
  const top1SellVal = sellers[0]?.val || 0
  const top3BuyVal = buyers.slice(0, 3).reduce((s, b) => s + b.val, 0)
  const top3SellVal = sellers.slice(0, 3).reduce((s, b) => s + b.val, 0)
  const top5BuyVal = buyers.slice(0, 5).reduce((s, b) => s + b.val, 0)
  const top5SellVal = sellers.slice(0, 5).reduce((s, b) => s + b.val, 0)

  const totalBuyLot = buyers.reduce((s, b) => s + b.lot, 0)
  const totalSellLot = sellers.reduce((s, b) => s + b.lot, 0)
  const totalTurnoverLot = Math.max(1, (totalBuyLot + totalSellLot) / 2)

  // 2. FORMULA CONCENTRATION RATIO (CR1, CR3, CR5)
  // Mengukur seberapa dominan segelintir broker besar menguasai transaksi
  const cr1Buy = totalBuyLot > 0 ? (top1BuyLot / totalBuyLot) * 100 : 0
  const cr1Sell = totalSellLot > 0 ? (top1SellLot / totalSellLot) * 100 : 0
  const cr3Buy = totalBuyLot > 0 ? (top3BuyLot / totalBuyLot) * 100 : 0
  const cr3Sell = totalSellLot > 0 ? (top3SellLot / totalSellLot) * 100 : 0
  const cr5Buy = totalBuyLot > 0 ? (top5BuyLot / totalBuyLot) * 100 : 0
  const cr5Sell = totalSellLot > 0 ? (top5SellLot / totalSellLot) * 100 : 0

  // 3. NET FLOW TOP BROKERS
  const netTop1Lot = top1BuyLot - top1SellLot
  const netTop3Lot = top3BuyLot - top3SellLot
  const netTop5Lot = top5BuyLot - top5SellLot

  const netTop1Val = top1BuyVal - top1SellVal
  const netTop3Val = top3BuyVal - top3SellVal
  const netTop5Val = top5BuyVal - top5SellVal

  // 4. BANDAR DETECTOR SCORE (-100 s/d +100)
  // Formula terbobot: 40% Net Top 5 vs Total Turnover + 35% Concentration Spread + 25% Top 1 vs Top 3
  const flowRatio = (netTop5Lot / totalTurnoverLot) * 100
  const concentrationSpread = (cr5Buy - cr5Sell) // Jika pembeli jauh lebih terkonsentrasi daripada penjual -> Akumulasi
  const top1Dominance = (cr1Buy - cr1Sell)

  let bandarScore = Math.round((flowRatio * 0.45) + (concentrationSpread * 0.35) + (top1Dominance * 0.20))
  bandarScore = Math.max(-100, Math.min(100, bandarScore))

  // 5. KLASIFIKASI KATEGORI SPEKTRUM (Sesuai Stockbit)
  let status = 'Neutral'
  let color = '#94A3B8'
  let statusIndo = 'Netral'
  let phase = 'Konsolidasi / Seimbang'
  let rationale = ''

  if (bandarScore >= 45) {
    status = 'Big Acc'
    statusIndo = 'AKUMULASI MASIF (Big Acc)'
    color = '#10B981'
    phase = 'Fase Mark-up / Akumulasi Kuat Institusi'
    rationale = `Top 5 Buyer menguasai ${cr5Buy.toFixed(1)}% total volume beli, jauh melampaui tekanan jual (${cr5Sell.toFixed(1)}%). Smart money aktif memborong barang.`
  } else if (bandarScore >= 15) {
    status = 'Acc'
    statusIndo = 'AKUMULASI NORMAL (Acc)'
    color = '#34D399'
    phase = 'Fase Base Building (Akumulasi Senyap)'
    rationale = `Net Buy terdeteksi di broker institusi. Distribusi dari ritel mulai diserap secara bertahap.`
  } else if (bandarScore > -15) {
    status = 'Neutral'
    statusIndo = 'NETRAL / BALANCED'
    color = '#94A3B8'
    phase = 'Fase Sideways / Transaksi Seimbang'
    rationale = `Tidak ada broker yang mendominasi transaksi secara mutlak. Kekuatan beli dan jual seimbang.`
  } else if (bandarScore > -45) {
    status = 'Dist'
    statusIndo = 'DISTRIBUSI (Dist)'
    color = '#F87171'
    phase = 'Fase Distribusi Sedang / Pelepasan Barang'
    rationale = `Tekanan jual terkonsentrasi pada broker besar yang melepas barang ke banyak akun ritel.`
  } else {
    status = 'Big Dist'
    statusIndo = 'DISTRIBUSI MASIF (Big Dist)'
    color = '#EF4444'
    phase = 'Fase Mark-Down / Guyuran Institusi'
    rationale = `Top 5 Seller menguasai ${cr5Sell.toFixed(1)}% transaksi keluar. Risiko penurunan tajam sangat tinggi.`
  }

  // 6. VOLUME WEIGHTED AVERAGE PRICE (VWAP) BANDAR
  // Menghitung modal rata-rata Top 5 Buyer
  let smartMoneyAvgBuyPrice = stock.price
  if (top5BuyLot > 0 && top5BuyVal > 0) {
    smartMoneyAvgBuyPrice = Math.round(top5BuyVal / (top5BuyLot * 100))
  }

  // 7. JARAK HARGA SEKARANG DENGAN MODAL BANDAR (Bandar Spread %)
  const bandarSpreadPct = (((stock.price - smartMoneyAvgBuyPrice) / smartMoneyAvgBuyPrice) * 100).toFixed(2)

  // 8. LOGIKA ATURAN KEPUTUSAN ENTRY (Decision Matrix)
  let entryVerdict = 'WAIT'
  let entryReason = ''

  if (bandarScore >= 15 && Number(bandarSpreadPct) <= 2.5 && Number(bandarSpreadPct) >= -4) {
    entryVerdict = 'STRONG BUY'
    entryReason = `Sangat ideal untuk Entry! Saham sedang diakumulasi (Skor: ${bandarScore}) dan harga pasar (Rp ${stock.price.toLocaleString('id-ID')}) berada sangat dekat dengan modal bandar (Rp ${smartMoneyAvgBuyPrice.toLocaleString('id-ID')}, spread ${bandarSpreadPct}%). Downside risk sangat minim.`
  } else if (bandarScore >= 15 && Number(bandarSpreadPct) > 2.5) {
    entryVerdict = 'BUY ON WEAKNESS'
    entryReason = `Bandar sedang akumulasi, namun harga sudah lari +${bandarSpreadPct}% di atas modal mereka. Disarankan antre Buy on Weakness (BoW) di dekat area modal bandar (Rp ${smartMoneyAvgBuyPrice.toLocaleString('id-ID')}) daripada mengejar harga.`
  } else if (bandarScore < -15) {
    entryVerdict = 'AVOID / EXIT'
    entryReason = `DILARANG ENTRY! Bandar/Smart money sedang melakukan distribusi (${statusIndo}). Membeli saham saat distribusi berisiko tinggi terjebak menjadi penampung barang bandar.`
  } else {
    entryVerdict = 'NEUTRAL / WAIT'
    entryReason = `Belum ada konfirmasi akumulasi dari bandar. Lebih baik pantau (*wait and see*) hingga volume akumulasi muncul di dekat level Support.`
  }

  return {
    bandarScore,
    status,
    statusIndo,
    color,
    phase,
    rationale,
    top1: { buyLot: top1BuyLot, sellLot: top1SellLot, netLot: netTop1Lot, netVal: netTop1Val, crBuy: cr1Buy, crSell: cr1Sell },
    top3: { buyLot: top3BuyLot, sellLot: top3SellLot, netLot: netTop3Lot, netVal: netTop3Val, crBuy: cr3Buy, crSell: cr3Sell },
    top5: { buyLot: top5BuyLot, sellLot: top5SellLot, netLot: netTop5Lot, netVal: netTop5Val, crBuy: cr5Buy, crSell: cr5Sell },
    smartMoneyAvgBuyPrice,
    bandarSpreadPct,
    entryVerdict,
    entryReason,
    totalTurnoverLot
  }
}
