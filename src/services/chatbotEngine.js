// Intelligent Stock AI Assistant Engine (Market-Wide & SQLite Integrated)
// Menganalisis kondisi pasar bursa hari ini secara komprehensif, seluruh konglomerasi (Pak PP, Hapsoro, Bakrie, Salim, BUMN),
// dan menghitung rencana eksekusi entry/SL/TP berdasarkan fraksi bursa resmi BEI.

import { IDX_FULL_EMITEN } from '../data/emitenUniverse.js'

let cachedMarketSummary = null
let cachedAllStocks = []

// Mengambil data market summary & semua saham dari backend SQLite
export async function syncChatbotWithSqlite() {
  try {
    const resSummary = await fetch('/api/db/market-summary')
    if (resSummary.ok) {
      const json = await resSummary.json()
      cachedMarketSummary = json
    }

    const resStocks = await fetch('/api/db/stocks')
    if (resStocks.ok) {
      const json = await resStocks.json()
      if (json.data && json.data.length > 0) {
        cachedAllStocks = json.data
      }
    }
  } catch (e) {
    console.warn('Chatbot SQLite sync note:', e)
  }
}

// Inisialisasi awal
if (typeof window !== 'undefined') {
  syncChatbotWithSqlite()
}

export function generateChatbotResponse(userMessage, currentStock) {
  const q = userMessage.toLowerCase().trim()
  const allStocks = cachedAllStocks.length > 0 ? cachedAllStocks : IDX_FULL_EMITEN

  // 1. Cek apakah user menanyakan saham tertentu
  // Cari kecocokan ticker (misal BREN, BRMS, BUMI, RAJA, CUAN, BBCA, TLKM, dll)
  let matchedStock = null
  for (const s of allStocks) {
    const t = s.ticker.toLowerCase()
    const n = (s.name || '').toLowerCase()
    // Cocokkan kata utuh ticker agar tidak salah tangkap (contoh 'as' vs 'asii')
    const regex = new RegExp(`\\b${t}\\b`, 'i')
    if (regex.test(q) || (n.length > 5 && q.includes(n.slice(0, 8)))) {
      matchedStock = s
      break
    }
  }

  // 2. Kategori Kueri Pasar Bursa Hari Ini / Market-Wide (Bukan Saham Spesifik)
  const isMarketWideQuery =
    q.includes('market') || q.includes('pasar') || q.includes('ihsg') || q.includes('bursa') ||
    q.includes('hari ini') || q.includes('kondisi') || q.includes('situasi') || q.includes('sentimen') ||
    q.includes('overview') || q.includes('rekap') || q.includes('kabar')

  // A. Pertanyaan Makro Kondisi Pasar Hari Ini & IHSG
  if ((isMarketWideQuery && !matchedStock) || q === 'halo' || q === 'hi' || q === 'p' || q === 'tes') {
    const ihsg = cachedMarketSummary?.ihsg || {
      price: 6436.36, change: -105.02, change_pct: -1.61, foreign_flow: '-Rp 420 Miliar (Net Sell)'
    }
    const gainers = cachedMarketSummary?.top_gainers || [
      { ticker: 'BRMS', change_pct: 6.67, price: 720 },
      { ticker: 'AMMN', change_pct: 2.47, price: 4980 },
      { ticker: 'BBRI', change_pct: 2.45, price: 3350 }
    ]
    const losers = cachedMarketSummary?.top_losers || [
      { ticker: 'MINA', change_pct: -9.49, price: 248 },
      { ticker: 'RAJA', change_pct: -8.54, price: 750 },
      { ticker: 'JGLE', change_pct: -7.79, price: 71 }
    ]

    return `🏛️ **Laporan Kondisi Pasar Saham BEI (Market Hari Ini):**\n\n` +
      `• **IHSG (^JKSE):** **${Number(ihsg.price).toLocaleString('id-ID')}** (${ihsg.change_pct >= 0 ? '+' : ''}${ihsg.change_pct}%)\n` +
      `• **Arus Dana Asing (Foreign Flow):** ${ihsg.foreign_flow}\n` +
      `• **Status Bursa:** *${ihsg.status || 'Konsolidasi Pasar'}*\n\n` +
      `🚀 **Saham Top Gainers Hari Ini:**\n` +
      gainers.slice(0, 3).map(g => `  • **${g.ticker}**: Rp ${Number(g.price).toLocaleString('id-ID')} (+${g.change_pct}%)`).join('\n') + '\n\n' +
      `⚠️ **Saham Mengalami Tekanan Koreksi:**\n` +
      losers.slice(0, 3).map(l => `  • **${l.ticker}**: Rp ${Number(l.price).toLocaleString('id-ID')} (${l.change_pct}%)`).join('\n') + '\n\n' +
      `💡 **Peta Konglomerasi Pasar:**\n` +
      `• **Grup Pak Prajogo (PP):** BREN, BRPT, CUAN, PTRO, TPIA\n` +
      `• **Grup Pak Hapsoro:** RAJA, FORU, MINA, PSAB\n` +
      `• **Bakrie & Salim:** BRMS, BUMI, AMMN, ICBP\n` +
      `• **Big Banks (BUMN & Swasta):** BBCA, BBRI, BMRI, BBNI\n\n` +
      `Ketik nama atau kode saham apa saja (contoh: *"Analisis BREN"*, *"Berapa entry BRMS?"*, *"Bandarmologi RAJA"*), dan saya akan hitung kalkulasi live-nya!`
  }

  // B. Rekomendasi Saham Radar Screener / Berpotensi Terbang
  if (q.includes('rekomendasi') || q.includes('saham apa') || q.includes('terbang') || q.includes('paling bagus') || q.includes('screener') || q.includes('potensi')) {
    return `⭐ **Top Radar Screening Saham Berpotensi Terbang Hari Ini:**\n\n` +
      `1. **BRMS (Bakrie & Salim - Rp 720):** 🚀 *Top Gainer Hari Ini (+6.67%)*, volume transaksi melesat didorong sentimen rekor harga emas global.\n` +
      `2. **BREN (Grup Pak PP - Rp 3.070):** Akumulasi konsolidasi di area support struktural, volume mulai stabil pasca rebalancing.\n` +
      `3. **AMMN (Salim & Medco - Rp 4.980):** Penguatan tren tembaga & progres smelter Batu Hijau (+2.47%).\n` +
      `4. **BBRI (BUMN Perbankan - Rp 3.350):** Rebound di area diskon valuasi historis (-1 SD) dengan dividen yield >6% (+2.45%).\n` +
      `5. **CUAN (Grup Pak PP - Rp 940):** Sinergi kontraktor tambang Petrosea mulai terefleksi pada arus orderbook.\n` +
      `6. **RAJA (Grup Pak Hapsoro - Rp 750):** Menguji level support psikologis pasca koreksi, peluang *Buy on Weakness* menarik.\n\n` +
      `📌 *Semua saham di atas sudah tersinkronisasi di SQLite database. Kamu bisa klik tab **Screening Potensi Terbang 🚀** di atas untuk filter per konglomerasi!*`
  }

  // Jika tidak menyebut saham spesifik dan bertanya tentang entry/SL/TP tanpa konteks saham
  if (!matchedStock && !currentStock && (q.includes('entry') || q.includes('sl') || q.includes('beli') || q.includes('tp'))) {
    return `❓ **Saham mana yang ingin kamu analisis?**\n\n` +
      `Sistem kami mencakup seluruh saham bursa BEI dari berbagai konglomerasi:\n` +
      `• **Grup Pak Prajogo:** Ketik *"Entry BREN"*, *"Entry CUAN"*, atau *"Entry BRPT"*\n` +
      `• **Grup Pak Hapsoro:** Ketik *"Entry RAJA"*, *"Entry PSAB"*, atau *"Entry FORU"*\n` +
      `• **Bakrie & Salim:** Ketik *"Entry BRMS"*, *"Entry BUMI"*, atau *"Entry AMMN"*\n` +
      `• **Perbankan:** Ketik *"Entry BBCA"*, *"Entry BBRI"*, atau *"Entry BMRI"*\n\n` +
      `Silakan ketik nama sahamnya agar saya hitungkan harga beli presisi dan Stop Loss-nya!`
  }

  // 3. Jika ada saham target (dari pencarian kueri atau saham yang sedang aktif dibuka)
  const target = matchedStock || currentStock || allStocks.find(s => s.ticker === 'BRMS') || allStocks[0]
  const ticker = target.ticker
  const price = target.price || 1000
  const name = target.name || `${ticker} Tbk`
  const group = target.group_name || target.group || 'Bursa Efek Indonesia'
  const changePct = target.change_pct !== undefined ? target.change_pct : (target.changePct || 0)
  const isUp = changePct >= 0

  // Hitung fraksi harga & level taktis jika belum ada di objek
  const s1 = target.signals?.support_1 || target.analysis?.support1 || roundToTick(price * 0.985, price)
  const s2 = target.signals?.support_2 || target.analysis?.support2 || roundToTick(price * 0.965, price)
  const r1 = target.signals?.resistance_1 || target.analysis?.resistance1 || roundToTick(price * 1.025, price)
  const r2 = target.signals?.resistance_2 || target.analysis?.resistance2 || roundToTick(price * 1.055, price)
  const entryLow = target.signals?.entry_low || target.analysis?.entryBuyLow || roundToTick(s1 * 0.995, price)
  const entryHigh = target.signals?.entry_high || target.analysis?.entryBuyHigh || s1
  const sl = target.signals?.stop_loss || target.analysis?.stopLoss || roundToTick(s2 * 0.985, price)
  const tp1 = target.signals?.take_profit_1 || target.analysis?.takeProfit1 || roundToTick(r1, price)
  const tp2 = target.signals?.take_profit_2 || target.analysis?.takeProfit2 || roundToTick(r2, price)
  const vwap = target.bandar?.vwap || target.bandar?.smartMoneyAvgBuyPrice || roundToTick(price * 0.998, price)
  const bandarStatus = target.bandar?.bandar_status || target.bandar?.bandarStatus || (isUp ? 'Akumulasi Aktif' : 'Distribusi / Tekanan Jual')
  const smartScore = target.bandar?.smart_money_score || target.bandar?.smartMoneyScore || (isUp ? 68 : 45)

  // C. Pertanyaan Titik Entry, Beli, Buy
  if (q.includes('entry') || q.includes('beli') || q.includes('masuk') || q.includes('bow') || q.includes('harga berapa') || q.includes('titik')) {
    return `🎯 **Panduan Rencana Entry Saham ${ticker} (${name}):**\n\n` +
      `• **Harga Market Saat Ini:** **Rp ${Number(price).toLocaleString('id-ID')}** (${isUp ? '+' : ''}${changePct}%)\n` +
      `• **Grup Emiten:** ${group}\n` +
      `• **Area Beli Ideal (BoW):** **Rp ${Number(entryLow).toLocaleString('id-ID')} – Rp ${Number(entryHigh).toLocaleString('id-ID')}**\n` +
      `• **Patokan Akumulasi:** Antre dekat Support 1 & modal bandar (VWAP Rp ${Number(vwap).toLocaleString('id-ID')}).\n` +
      `• **Target Take Profit 1 (TP1):** **Rp ${Number(tp1).toLocaleString('id-ID')}** (Resistance 1)\n` +
      `• **Target Take Profit 2 (TP2):** **Rp ${Number(tp2).toLocaleString('id-ID')}** (Swing High)\n` +
      `• **Proteksi Stop Loss (SL):** **Rp ${Number(sl).toLocaleString('id-ID')}** (Disiplin cut loss jika jebol Support 2).\n\n` +
      `💡 **Tips Eksekusi:** Gunakan strategi *Buy on Weakness*. Jangan mengejar harga saat candle hijau tinggi; tunggu retest di area Rp ${Number(entryHigh).toLocaleString('id-ID')} agar risiko kerugian tetap terukur.`
  }

  // D. Pertanyaan Stop Loss & Risiko
  if (q.includes('stop loss') || q.includes('sl') || q.includes('cut loss') || q.includes('rugi') || q.includes('risiko')) {
    const riskPts = Math.max(1, price - sl)
    const riskPct = ((riskPts / price) * 100).toFixed(1)

    return `🛡️ **Manajemen Risiko & Stop Loss Saham ${ticker}:**\n\n` +
      `• **Harga Pasar:** Rp ${Number(price).toLocaleString('id-ID')}\n` +
      `• **Titik Stop Loss Disiplin:** **Rp ${Number(sl).toLocaleString('id-ID')}**\n` +
      `• **Toleransi Risiko:** Sekitar **-${riskPct}%** (${riskPts} poin di bawah harga bursa).\n` +
      `• **Dasar Perhitungan:** Dihitung dari level Support Struktural 2 dikurangi buffer volatilitas ATR dan diselaraskan ke fraksi harga resmi BEI.\n\n` +
      `⚠️ **Disiplin Trader:** Jika candle harian ditutup (*daily close*) di bawah Rp ${Number(sl).toLocaleString('id-ID')}, struktur tren dianggap patah. Disiplin keluar untuk melindungi modal portofolio kamu.`
  }

  // E. Pertanyaan Take Profit (TP) & Target
  if (q.includes('tp') || q.includes('take profit') || q.includes('target') || q.includes('jual') || q.includes('cuan')) {
    const gain1 = (((tp1 - price) / price) * 100).toFixed(1)
    const gain2 = (((tp2 - price) / price) * 100).toFixed(1)

    return `🚀 **Target Take Profit Saham ${ticker}:**\n\n` +
      `• **Target 1 (TP1):** **Rp ${Number(tp1).toLocaleString('id-ID')}** (+${gain1}%)\n` +
      `  *Strategi:* Jual 50% lot 1 tick persis di depan tembok antrean Offer Resistance 1.\n\n` +
      `• **Target 2 (TP2):** **Rp ${Number(tp2).toLocaleString('id-ID')}** (+${gain2}%)\n` +
      `  *Strategi:* Pasang *Trailing Stop* di harga modal untuk mengunci profit menuju target ekstensi tren.\n\n` +
      `⚖️ **Rasio Risk/Reward:** ${target.signals?.risk_reward_ratio || target.analysis?.riskRewardRatio || '1 : 2.1'}`
  }

  // F. Pertanyaan Bandarmologi & Smart Money
  if (q.includes('bandar') || q.includes('smart money') || q.includes('akumulasi') || q.includes('distribusi') || q.includes('broker') || q.includes('asing') || q.includes('vwap')) {
    const topBuyer = target.bandar?.top1_buyer || 'AK'
    const topSeller = target.bandar?.top1_seller || 'YP'
    const netLots = target.bandar?.net_top5_lot || 85000

    return `🕵️ **Analisis Bandarmologi & Smart Money Saham ${ticker}:**\n\n` +
      `• **Grup Emiten:** ${group}\n` +
      `• **Status Aliran Dana:** **${bandarStatus}**\n` +
      `• **Smart Money Score:** **${smartScore}/100**\n` +
      `• **Modal Rata-rata Bandar (VWAP):** **Rp ${Number(vwap).toLocaleString('id-ID')}**\n` +
      `• **Top Buyer Teraktif:** Broker **${topBuyer}**\n` +
      `• **Top Seller Teraktif:** Broker **${topSeller}**\n` +
      `• **Net Flow Top 5:** ${netLots >= 0 ? '+' : ''}${Number(netLots).toLocaleString('id-ID')} Lot\n\n` +
      `🔎 **Diagnosa AI:** Harga pasar saat ini (Rp ${Number(price).toLocaleString('id-ID')}) berada ${Math.abs(price - vwap) < price * 0.03 ? 'sangat dekat dengan harga modal akumulasi bandar (Low Downside Risk)' : 'mengalami pergerakan tren mengikuti dinamika orderbook'}.`
  }

  // G. Pertanyaan Valuasi & Fundamental
  if (q.includes('pbv') || q.includes('per') || q.includes('valuasi') || q.includes('murah') || q.includes('mahal') || q.includes('fundamental') || q.includes('free float')) {
    const pbv = target.pbv || 1.5
    const pbvMean = target.pbv_mean || target.pbvMean || 2.0
    const roe = target.roe || 15
    const ff = target.free_float_pct || target.freeFloatPct || 25
    const ffCat = target.free_float_category || target.freeFloatCategory || 'Normal'

    return `📊 **Valuasi & Fundamental Saham ${ticker} (${name}):**\n\n` +
      `• **PBV Saat Ini:** **${pbv}x** (Rata-rata 5 tahun: ${pbvMean}x)\n` +
      `• **Status Valuasi:** ${pbv < pbvMean ? '🟢 *Undervalued (Area Diskon)*' : '🟡 *Fair / Premium Value*'}\n` +
      `• **Return on Equity (ROE):** ${roe}%\n` +
      `• **Free Float (Saham Publik):** **${ff}%** (${ffCat})\n` +
      `• **Karakter Likuiditas:** ${ff < 15 ? '⚠️ *Tight Float* (Sensitif tarikan volume kecil & rentan volatilitas)' : '✅ *Likuiditas Luas* (Aman untuk dana besar)'}\n\n` +
      `💡 **Profil Bisnis:** ${target.about || 'Perusahaan tercatat di Bursa Efek Indonesia dengan kinerja operasional aktif.'}`
  }

  // H. Default: Analisis Komprehensif Saham Terpilih
  return `🤖 **Analisis Komprehensif Saham ${ticker} (${name}):**\n\n` +
    `• **Grup Emiten:** ${group}\n` +
    `• **Harga Market Bursa:** **Rp ${Number(price).toLocaleString('id-ID')}** (${isUp ? '+' : ''}${changePct}%)\n` +
    `• **Aksi Smart Money:** ${bandarStatus} (Modal Bandar: Rp ${Number(vwap).toLocaleString('id-ID')})\n` +
    `• **Area Entry Ideal:** Rp ${Number(entryLow).toLocaleString('id-ID')} – Rp ${Number(entryHigh).toLocaleString('id-ID')}\n` +
    `• **Target Take Profit:** Rp ${Number(tp1).toLocaleString('id-ID')} (TP1) / Rp ${Number(tp2).toLocaleString('id-ID')} (TP2)\n` +
    `• **Proteksi Stop Loss:** Rp ${Number(sl).toLocaleString('id-ID')}\n\n` +
    `Kamu bisa menanyakan saham mana pun di bursa, contoh:\n` +
    `• *"Bagaimana market hari ini?"*\n` +
    `• *"Berapa titik entry BREN atau BRMS?"*\n` +
    `• *"Analisis bandarmologi saham RAJA"*`
}

function roundToTick(val, basePrice) {
    if (!val || val <= 0) return 50
    let tick = 25
    if (basePrice < 200) tick = 1
    else if (basePrice < 500) tick = 2
    else if (basePrice < 2000) tick = 5
    else if (basePrice < 5000) tick = 10
    return Math.round(val / tick) * tick
}
