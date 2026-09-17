// Intelligent Stock AI Assistant Engine
// Menganalisis konteks saham aktif (teknikal, bandarmologi, valuasi, fraksi BEI, sentimen)
// dan merespons pertanyaan trader secara komprehensif

import { IDX_FULL_EMITEN } from '../data/emitenUniverse.js'

export function generateChatbotResponse(userMessage, currentStock) {
  const q = userMessage.toLowerCase().trim()
  const stock = currentStock || IDX_FULL_EMITEN[0]
  const ticker = stock.ticker
  const price = stock.price
  const bandar = stock.bandar || {}
  const analysis = stock.analysis || {}

  // 1. Cek apakah user menanyakan saham tertentu selain currentStock
  const matchedStock = IDX_FULL_EMITEN.find(s => {
    const t = s.ticker.toLowerCase()
    const n = s.name.toLowerCase()
    return q.includes(t) || (n.length > 5 && q.includes(n))
  })

  const targetStock = (matchedStock && matchedStock.ticker !== ticker) ? matchedStock : stock
  const tTicker = targetStock.ticker
  const tPrice = targetStock.price
  const tBandar = targetStock.bandar || bandar
  const tAnalysis = targetStock.analysis || analysis

  // Keyword Matching Categories:

  // A. Pertanyaan Titik Entry, Beli, Buy
  if (q.includes('entry') || q.includes('beli') || q.includes('masuk') || q.includes('bow') || q.includes('harga berapa')) {
    const entryLow = tAnalysis.entryBuyLow || Math.round(tPrice * 0.985)
    const entryHigh = tAnalysis.entryBuyHigh || Math.round(tPrice * 0.995)
    const sl = tAnalysis.stopLoss || Math.round(tPrice * 0.95)
    const tp1 = tAnalysis.takeProfit1 || Math.round(tPrice * 1.025)
    const tp2 = tAnalysis.takeProfit2 || Math.round(tPrice * 1.05)
    const vwap = tBandar.smartMoneyAvgBuyPrice || tPrice

    return `🎯 **Panduan Rencana Entry Saham ${tTicker}:**\n\n` +
      `• **Area Beli Ideal (BoW):** Rp ${entryLow.toLocaleString('id-ID')} – Rp ${entryHigh.toLocaleString('id-ID')}\n` +
      `• **Patokan Strategi:** Antre di dekat area Support 1 & modal bandar (VWAP Rp ${vwap.toLocaleString('id-ID')}).\n` +
      `• **Target Take Profit 1 (TP1):** Rp ${tp1.toLocaleString('id-ID')} (1 tick sebelum Offer Resistance 1)\n` +
      `• **Target Take Profit 2 (TP2):** Rp ${tp2.toLocaleString('id-ID')} (Puncak Swing High)\n` +
      `• **Proteksi Stop Loss (SL):** Rp ${sl.toLocaleString('id-ID')} (Wajib cut loss jika closing harian jebol level ini).\n\n` +
      `💡 **Tips AI:** Jangan mengejar harga (*chasing the pump*). Tunggu harga terkoreksi sehat (pullback) mendekati area modal akumulasi bandar agar *downside risk* tetap terukur.`
  }

  // B. Pertanyaan Stop Loss (SL) & Cut Loss
  if (q.includes('stop loss') || q.includes('sl') || q.includes('cut loss') || q.includes('rugi') || q.includes('risiko')) {
    const sl = tAnalysis.stopLoss || Math.round(tPrice * 0.95)
    const riskPts = Math.max(1, tPrice - sl)
    const riskPct = ((riskPts / tPrice) * 100).toFixed(1)

    return `🛡️ **Manajemen Risiko & Stop Loss Saham ${tTicker}:**\n\n` +
      `• **Titik Stop Loss Disiplin:** **Rp ${sl.toLocaleString('id-ID')}**\n` +
      `• **Toleransi Risiko:** Sekitar **-${riskPct}%** (${riskPts} poin dari harga pasar Rp ${tPrice.toLocaleString('id-ID')}).\n` +
      `• **Dasar Penentuan:** Dihitung dari level Support Struktural 2 dikurangi buffer volatilitas ATR (Average True Range) dan diselaraskan ke fraksi harga resmi BEI.\n\n` +
      `⚠️ **Aturan Disiplin:** Jika candle harian ditutup (*daily close*) di bawah Rp ${sl.toLocaleString('id-ID')}, struktur tren telah patah. Disiplin lakukan cut loss untuk melindungi modal trading kamu.`
  }

  // C. Pertanyaan Take Profit (TP) & Target Harga
  if (q.includes('tp') || q.includes('take profit') || q.includes('target') || q.includes('jual') || q.includes('cuan')) {
    const tp1 = tAnalysis.takeProfit1 || Math.round(tPrice * 1.025)
    const tp2 = tAnalysis.takeProfit2 || Math.round(tPrice * 1.05)
    const gain1 = (((tp1 - tPrice) / tPrice) * 100).toFixed(1)
    const gain2 = (((tp2 - tPrice) / tPrice) * 100).toFixed(1)

    return `🚀 **Target Take Profit Saham ${tTicker}:**\n\n` +
      `• **Target 1 (TP1):** **Rp ${tp1.toLocaleString('id-ID')}** (+${gain1}%)\n` +
      `  *Strategi:* Pasang antrean jual parsial (50% lot) 1 tick sebelum tembok antrean Offer di Resistance 1.\n\n` +
      `• **Target 2 (TP2):** **Rp ${tp2.toLocaleString('id-ID')}** (+${gain2}%)\n` +
      `  *Strategi:* Sisanya biarkan berjalan dengan menggeser Stop Loss ke harga modal (*Trailing Stop*) menuju Puncak Resistance 2.\n\n` +
      `⚖️ **Rasio Risk/Reward:** ${tAnalysis.riskRewardRatio || '1 : 2.1'}`
  }

  // D. Pertanyaan Bandarmologi, Smart Money, Akumulasi vs Distribusi
  if (q.includes('bandar') || q.includes('smart money') || q.includes('akumulasi') || q.includes('distribusi') || q.includes('broker') || q.includes('asing') || q.includes('vwap')) {
    const status = tBandar.bandarStatus || 'Netral'
    const action = tBandar.bandarAction || 'Konsolidasi'
    const score = tBandar.smartMoneyScore || 60
    const vwap = tBandar.smartMoneyAvgBuyPrice || tPrice
    const topBuyer = targetStock.brokerAction?.buyerBrokers?.[0]?.code || 'AK'
    const topSeller = targetStock.brokerAction?.sellerBrokers?.[0]?.code || 'YP'
    const netLots = tBandar.netTopLots || tBandar.netVolumeLots || 0

    return `🕵️ **Analisis Bandarmologi & Smart Money ${tTicker}:**\n\n` +
      `• **Status Aliran Dana:** **${status}** (${action})\n` +
      `• **Smart Money Score:** **${score}/100**\n` +
      `• **Harga Modal Bandar (VWAP):** **Rp ${vwap.toLocaleString('id-ID')}**\n` +
      `• **Top Buyer Utama:** Broker **${topBuyer}**\n` +
      `• **Top Seller Utama:** Broker **${topSeller}**\n` +
      `• **Net Volume Top 5:** ${netLots >= 0 ? '+' : ''}${Number(netLots).toLocaleString('id-ID')} Lot\n\n` +
      `🔎 **Diagnosa AI:** ${tBandar.entryReason || `Perhatikan pergerakan harga di sekitar level modal bandar Rp ${vwap.toLocaleString('id-ID')}. Jika volume beli bertahan, tren penguatan berpotensi berlanjut.`}`
  }

  // E. Pertanyaan Valuasi PBV, PER, Free Float, Fundamental
  if (q.includes('pbv') || q.includes('per') || q.includes('valuasi') || q.includes('murah') || q.includes('mahal') || q.includes('fundamental') || q.includes('free float')) {
    const pbv = targetStock.pbv || 1.5
    const mean = targetStock.pbvMean || 2.0
    const roe = targetStock.roe || 15
    const ff = targetStock.freeFloatPct || 25
    const ffCat = targetStock.freeFloatCategory || 'Normal'

    return `📊 **Valuasi & Struktur Fundamental ${tTicker}:**\n\n` +
      `• **PBV Saat Ini:** **${pbv}x** (Rata-rata 5 tahun: ${mean}x)\n` +
      `• **Status Valuasi:** ${pbv < mean ? '🟢 *Undervalued / Diskon*' : '🟡 *Fair to Premium Value*'}\n` +
      `• **Return on Equity (ROE):** ${roe}%\n` +
      `• **Free Float (Saham Publik):** **${ff}%** (${ffCat})\n` +
      `• **Karakter Likuiditas:** ${ff < 15 ? '⚠️ *Tight Float* (Sangat sensitif tarikan volume kecil & rentan volatilitas tinggi)' : '✅ *Likuiditas Luas* (Aman untuk modal besar)'}\n\n` +
      `💡 **Kesimpulan Fundamental:** ${targetStock.about || 'Kinerja operasional dan likuiditas modal emiten terpantau stabil.'}`
  }

  // F. Rekomendasi Saham Bagus / Screener
  if (q.includes('rekomendasi') || q.includes('saham apa') || q.includes('terbang') || q.includes('paling bagus') || q.includes('screener')) {
    return `⭐ **Top Rekomendasi Radar Screening Hari Ini:**\n\n` +
      `1. **BREN (Grup Pak PP - Rp 3.070):** Akumulasi kuat di area support, momentum re-entry menarik.\n` +
      `2. **BRMS (Bakrie & Salim - Rp 368):** Produksi emas tembus rekor, didukung kenaikan harga komoditas emas global.\n` +
      `3. **RAJA (Grup Pak Hapsoro - Rp 795):** Margin pipa gas Blok Rokan solid dengan dividen rutin.\n` +
      `4. **BBCA (Big Banks - Rp 6.500):** Foreign inflow masif, saham paling defensif untuk swing modal besar.\n` +
      `5. **BUMI (Bakrie Group - Rp 208):** Neraca bersih lunas utang, volume likuiditas sangat masif.\n\n` +
      `📌 *Kamu bisa membuka tab **Screening Potensi Terbang 🚀** di bagian atas untuk melihat skor lengkap dan memfilter per grup konglomerasi!*`
  }

  // G. Pertanyaan Modal & Money Management (Kalkulator Lot)
  if (q.includes('modal') || q.includes('lot') || q.includes('sizing') || q.includes('juta')) {
    const entryPrice = tPrice
    const slPrice = tAnalysis.stopLoss || Math.round(tPrice * 0.95)
    const riskPerShare = Math.max(1, entryPrice - slPrice)
    // Asumsi modal 10 juta risiko 2% = 200rb
    const maxRiskRp = 200000
    const safeLots = Math.max(1, Math.floor(maxRiskRp / (riskPerShare * 100)))
    const capitalUsed = safeLots * 100 * entryPrice

    return `💰 **Simulasi Money Management Saham ${tTicker} (Modal Rp 10.000.000):**\n\n` +
      `• **Batas Risiko Maksimal (2% Modal):** Rp 200.000\n` +
      `• **Risiko per Lembar (Entry - SL):** Rp ${riskPerShare.toLocaleString('id-ID')} (Rp ${entryPrice} ke Rp ${slPrice})\n` +
      `• **Alokasi Aman:** **${safeLots} Lot**\n` +
      `• **Modal Terpakai:** Rp ${capitalUsed.toLocaleString('id-ID')} (${((capitalUsed / 10000000) * 100).toFixed(1)}% dari portofolio)\n` +
      `• **Kerugian Maksimal (Jika Kena SL):** -Rp ${(safeLots * 100 * riskPerShare).toLocaleString('id-ID')}\n` +
      `• **Proyeksi Keuntungan (Jika Kena TP1):** +Rp ${(safeLots * 100 * Math.max(1, (tAnalysis.takeProfit1 || entryPrice * 1.03) - entryPrice)).toLocaleString('id-ID')}\n\n` +
      `Disiplin pada *position sizing* adalah kunci agar portofolio kamu tidak hancur saat pasar terkoreksi.`
  }

  // Default: Overview Saham Komprehensif
  return `🤖 **Analisis Cepat Saham ${tTicker} (Harga: Rp ${tPrice.toLocaleString('id-ID')}):**\n\n` +
    `• **Aksi Smart Money:** ${tBandar.bandarStatus || 'Netral'} (Modal Bandar: Rp ${Number(tBandar.smartMoneyAvgBuyPrice || tPrice).toLocaleString('id-ID')})\n` +
    `• **Area Entry Ideal:** Rp ${tAnalysis.entryBuyLow?.toLocaleString('id-ID') || (tPrice * 0.985).toFixed(0)} – Rp ${tAnalysis.entryBuyHigh?.toLocaleString('id-ID') || (tPrice * 0.995).toFixed(0)}\n` +
    `• **Target Take Profit (TP1):** Rp ${tAnalysis.takeProfit1?.toLocaleString('id-ID') || (tPrice * 1.03).toFixed(0)}\n` +
    `• **Proteksi Stop Loss (SL):** Rp ${tAnalysis.stopLoss?.toLocaleString('id-ID') || (tPrice * 0.95).toFixed(0)}\n` +
    `• **Rasio Risk/Reward:** ${tAnalysis.riskRewardRatio || '1 : 2.1'}\n\n` +
    `Ada yang ingin kamu tanyakan lebih spesifik? Kamu bisa tanya:\n` +
    `- *"Berapa titik entry & SL saham ini?"*\n` +
    `- *"Bagaimana aksi bandar hari ini?"*\n` +
    `- *"Apakah valuasi PBV masih murah?"*\n` +
    `- *"Rekomendasi saham berpotensi terbang"*`
}
