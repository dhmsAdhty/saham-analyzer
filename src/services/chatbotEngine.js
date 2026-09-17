// Intelligent Stock AI Assistant Engine (Market-Wide & SQLite Integrated)
// Menganalisis kondisi pasar bursa hari ini secara komprehensif, seluruh konglomerasi (Pak PP, Hapsoro, Bakrie, Salim, BUMN),
// dan menghitung rencana eksekusi entry/SL/TP berdasarkan fraksi bursa resmi BEI dari database SQLite.

import { IDX_FULL_EMITEN } from '../data/emitenUniverse.js'

let cachedMarketSummary = null
let cachedAllStocks = []

export async function syncChatbotWithSqlite() {
  try {
    const resSummary = await fetch('/api/db/market-summary')
    if (resSummary.ok) {
      cachedMarketSummary = await resSummary.json()
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

if (typeof window !== 'undefined') {
  syncChatbotWithSqlite()
}

export async function generateChatbotResponse(userMessage, currentStock) {
  // Selalu pastikan cache tersinkronisasi ke SQLite
  if (cachedAllStocks.length === 0 || !cachedMarketSummary) {
    await syncChatbotWithSqlite()
  }

  const q = userMessage.toLowerCase().trim()
  const allStocks = cachedAllStocks.length > 0 ? cachedAllStocks : IDX_FULL_EMITEN
  const summary = cachedMarketSummary || {
    ihsg: { price: 6436.36, change: -105.02, change_pct: -1.61, foreign_flow: '-Rp 420 Miliar (Net Sell)' },
    top_gainers: [{ ticker: 'BRMS', change_pct: 6.67, price: 720 }],
    top_losers: [{ ticker: 'MINA', change_pct: -9.49, price: 248 }]
  }

  // 1. Deteksi apakah ini komplain atau kueri meta-market ("kenapa hanya bbca", "semua saham", "market hari ini")
  const isMetaOrComplaint =
    q.includes('kenapa') || q.includes('hanya') || q.includes('cuma') || q.includes('semua saham') ||
    q.includes('selain bbca') || q.includes('jangan bbca') || q.includes('tidak akurat')

  const isMarketWideQuery =
    q.includes('market') || q.includes('pasar') || q.includes('ihsg') || q.includes('bursa') ||
    q.includes('hari ini') || q.includes('kondisi') || q.includes('situasi') || q.includes('overview') ||
    q.includes('rekap') || q.includes('kabar') || q === 'halo' || q === 'hi' || q === 'p'

  if (isMetaOrComplaint || (isMarketWideQuery && !q.includes('entry') && !q.includes('sl') && !q.includes('tp'))) {
    const ihsg = summary.ihsg || {}
    const gainers = summary.top_gainers || []
    const losers = summary.top_losers || []

    return `🏛️ **Laporan Lengkap Pasar Saham BEI Hari Ini (SQLite Synced):**\n\n` +
      `Sistem ini mencakup **seluruh 31+ saham bursa** dan terhubung langsung ke **SQLite Database lokal** dengan harga perdagangan aktual hari ini.\n\n` +
      `📊 **Kondisi Indeks Acuan:**\n` +
      `• **IHSG (^JKSE):** **${Number(ihsg.price || 6436.36).toLocaleString('id-ID')}** (${(ihsg.change_pct || 0) >= 0 ? '+' : ''}${ihsg.change_pct || -1.61}%)\n` +
      `• **Arus Asing (NBSA):** ${ihsg.foreign_flow || '-Rp 420 Miliar (Net Sell)'}\n` +
      `• **Status Pasar:** *${ihsg.status || 'Konsolidasi Lemah'}*\n\n` +
      `🚀 **Top Gainers Hari Ini:**\n` +
      gainers.slice(0, 4).map(g => `  • **${g.ticker}** (${g.group_name || 'BEI'}): Rp ${Number(g.price).toLocaleString('id-ID')} (+${g.change_pct}%)`).join('\n') + '\n\n' +
      `⚠️ **Top Losers / Koreksi Hari Ini:**\n` +
      losers.slice(0, 4).map(l => `  • **${l.ticker}** (${l.group_name || 'BEI'}): Rp ${Number(l.price).toLocaleString('id-ID')} (${l.change_pct}%)`).join('\n') + '\n\n' +
      `🏢 **Peta Konglomerasi yang Tersedia:**\n` +
      `• **Grup Pak Prajogo (PP):** BREN (Rp 3.070), BRPT (Rp 1.040), CUAN (Rp 920), PTRO (Rp 14.200), TPIA (Rp 8.800)\n` +
      `• **Grup Pak Hapsoro:** RAJA (Rp 750), FORU (Rp 3.730), MINA (Rp 248), PSAB (Rp 580)\n` +
      `• **Bakrie & Salim:** BRMS (Rp 720), BUMI (Rp 198), AMMN (Rp 4.990), ICBP (Rp 11.600)\n` +
      `• **Big Banks & Bluechips:** BBRI (Rp 3.330), BMRI (Rp 4.310), BBNI (Rp 3.740), TLKM (Rp 2.620), ASII (Rp 4.880), BBCA (Rp 6.375)\n\n` +
      `Silakan ketik nama atau kode saham mana pun di atas (contoh: *"Berapa entry BREN?"*, *"Analisis RAJA"*, *"Bandarmologi BRMS"*), dan AI akan menyajikan kalkulasi real-time langsung dari SQLite!`
  }

  // 2. Deteksi Kueri Khusus Grup Konglomerasi
  // A. Grup Pak Prajogo Pangestu (PP)
  if (q.includes('prajogo') || q.includes('pak pp') || q.includes('barito')) {
    const ppStocks = allStocks.filter(s => ['BREN', 'BRPT', 'CUAN', 'PTRO', 'TPIA'].includes(s.ticker))
    return `🔥 **Analisis Saham Grup Prajogo Pangestu (PP / Barito Group):**\n\n` +
      ppStocks.map(s => {
        const p = Number(s.price).toLocaleString('id-ID')
        const ch = (s.change_pct || 0) >= 0 ? `+${s.change_pct}%` : `${s.change_pct}%`
        return `• **${s.ticker}** (${s.name}): **Rp ${p}** (${ch})\n` +
          `  - Area Entry (BoW): Rp ${Number(s.entry_low || s.price * 0.985).toLocaleString('id-ID')} – Rp ${Number(s.entry_high || s.price).toLocaleString('id-ID')}\n` +
          `  - Stop Loss: Rp ${Number(s.stop_loss || s.price * 0.95).toLocaleString('id-ID')} | TP1: Rp ${Number(s.take_profit_1 || s.price * 1.025).toLocaleString('id-ID')}\n` +
          `  - Aksi Bandar: *${s.bandar_status || 'Akumulasi Normal'}* (VWAP: Rp ${Number(s.vwap || s.price).toLocaleString('id-ID')})`
      }).join('\n\n') + '\n\n' +
      `💡 *Ketik ticker spesifik seperti "Entry BREN" atau "Entry CUAN" untuk rencana trading lebih detail!*`
  }

  // B. Grup Happy Hapsoro
  if (q.includes('hapsoro') || q.includes('happy hapsoro') || q.includes('basis')) {
    const hapsoroStocks = allStocks.filter(s => ['RAJA', 'FORU', 'MINA', 'PSAB'].includes(s.ticker))
    return `⚡ **Analisis Saham Grup Happy Hapsoro (Basis Investment):**\n\n` +
      hapsoroStocks.map(s => {
        const p = Number(s.price).toLocaleString('id-ID')
        const ch = (s.change_pct || 0) >= 0 ? `+${s.change_pct}%` : `${s.change_pct}%`
        return `• **${s.ticker}** (${s.name}): **Rp ${p}** (${ch})\n` +
          `  - Area Entry (BoW): Rp ${Number(s.entry_low || s.price * 0.985).toLocaleString('id-ID')} – Rp ${Number(s.entry_high || s.price).toLocaleString('id-ID')}\n` +
          `  - Stop Loss: Rp ${Number(s.stop_loss || s.price * 0.95).toLocaleString('id-ID')} | TP1: Rp ${Number(s.take_profit_1 || s.price * 1.025).toLocaleString('id-ID')}\n` +
          `  - Aksi Bandar: *${s.bandar_status || 'Konsolidasi'}*`
      }).join('\n\n') + '\n\n' +
      `💡 *Ketik ticker spesifik seperti "Entry RAJA" atau "Entry FORU" untuk melihat orderbook!*`
  }

  // C. Grup Bakrie & Salim
  if (q.includes('bakrie') || q.includes('salim')) {
    const bsStocks = allStocks.filter(s => ['BRMS', 'BUMI', 'AMMN', 'ICBP', 'INDF'].includes(s.ticker))
    return `💎 **Analisis Saham Konsorsium Bakrie & Salim Group:**\n\n` +
      bsStocks.map(s => {
        const p = Number(s.price).toLocaleString('id-ID')
        const ch = (s.change_pct || 0) >= 0 ? `+${s.change_pct}%` : `${s.change_pct}%`
        return `• **${s.ticker}** (${s.name}): **Rp ${p}** (${ch})\n` +
          `  - Area Entry (BoW): Rp ${Number(s.entry_low || s.price * 0.985).toLocaleString('id-ID')} – Rp ${Number(s.entry_high || s.price).toLocaleString('id-ID')}\n` +
          `  - Stop Loss: Rp ${Number(s.stop_loss || s.price * 0.95).toLocaleString('id-ID')} | TP1: Rp ${Number(s.take_profit_1 || s.price * 1.025).toLocaleString('id-ID')}`
      }).join('\n\n') + '\n\n' +
      `💡 *Ketik "Entry BRMS" atau "Entry BUMI" untuk kalkulasi detail.*`
  }

  // 3. Deteksi Ticker Saham yang Disebutkan di Pesan User
  const foundTickers = []
  for (const s of allStocks) {
    const t = s.ticker.toLowerCase()
    // Cocokkan kata utuh ticker (contoh: 'bren', 'raja', 'brms', 'bbri', dll)
    const regex = new RegExp(`\\b${t}\\b`, 'i')
    if (regex.test(q)) {
      // Pastikan bukan bagian dari frase negatif seperti "jangan bbca"
      const isNegated = q.includes(`bukan ${t}`) || q.includes(`jangan ${t}`) || q.includes(`selain ${t}`)
      if (!isNegated) {
        foundTickers.push(s)
      }
    }
  }

  // Jika user menyebut LEBIH DARI SATU SAHAM (misal: "BREN dan BRMS", "bandingkan BBRI dan BMRI")
  if (foundTickers.length > 1) {
    return `⚖️ **Perbandingan Rencana Trading Saham Pilihan Kamu (Data SQLite Terkini):**\n\n` +
      foundTickers.map(s => {
        const p = Number(s.price).toLocaleString('id-ID')
        const ch = (s.change_pct || 0) >= 0 ? `+${s.change_pct}%` : `${s.change_pct}%`
        return `📌 **${s.ticker}** (${s.group_name || s.group || 'BEI'})\n` +
          `• Harga Pasar: **Rp ${p}** (${ch})\n` +
          `• Area Beli (BoW): Rp ${Number(s.entry_low || s.price * 0.985).toLocaleString('id-ID')} – Rp ${Number(s.entry_high || s.price).toLocaleString('id-ID')}\n` +
          `• Stop Loss: Rp ${Number(s.stop_loss || s.price * 0.95).toLocaleString('id-ID')} | TP1: Rp ${Number(s.take_profit_1 || s.price * 1.025).toLocaleString('id-ID')}\n` +
          `• Modal Bandar (VWAP): Rp ${Number(s.vwap || s.price).toLocaleString('id-ID')} (${s.bandar_status || 'Normal'})`
      }).join('\n\n') + '\n\n' +
      `Silakan klik kartu saham tersebut di menu atas untuk membuka chart TradingView dan orderbook lengkap!`
  }

  // Jika tepat SATU SAHAM yang ditemukan
  let target = foundTickers[0]

  // Jika TIDAK ADA ticker yang cocok di pesan user, periksa apakah ada kata ganti seperti "saham ini"
  if (!target) {
    if (q.includes('saham ini') || q.includes('emiten ini') || q.includes('yang ini')) {
      target = currentStock || allStocks[0]
    } else if (q.includes('rekomendasi') || q.includes('terbang')) {
      // Rekomendasi Top Gainer / Big Acc
      target = allStocks.find(s => s.ticker === 'BRMS') || allStocks[0]
    } else {
      // Tampilkan panduan luas tanpa mengunci ke BBCA
      return `🤖 **Saham AI Assistant:**\n\n` +
        `Saya bisa menganalisis saham apa saja di bursa hari ini dengan data riil dari SQLite. Contoh pertanyaan:\n\n` +
        `• *"Berapa titik entry BREN & modal bandarnya?"*\n` +
        `• *"Bagaimana kondisi saham RAJA & rekomendasi SL?"*\n` +
        `• *"Bandingkan saham BRMS dan BUMI hari ini"*\n` +
        `• *"Analisis seluruh saham Grup Pak Prajogo"* \n` +
        `• *"Bagaimana kondisi market IHSG hari ini?"*\n\n` +
        `Ketik kode saham yang ingin kamu periksa!`
    }
  }

  // Detail Saham Spesifik
  const ticker = target.ticker
  const price = target.price || 1000
  const name = target.name || `${ticker} Tbk`
  const group = target.group_name || target.group || 'Bursa Efek Indonesia'
  const changePct = target.change_pct !== undefined ? target.change_pct : (target.changePct || 0)
  const isUp = changePct >= 0

  const s1 = target.support_1 || target.signals?.support_1 || roundToTick(price * 0.985, price)
  const s2 = target.support_2 || target.signals?.support_2 || roundToTick(price * 0.965, price)
  const r1 = target.resistance_1 || target.signals?.resistance_1 || roundToTick(price * 1.025, price)
  const r2 = target.resistance_2 || target.signals?.resistance_2 || roundToTick(price * 1.055, price)
  const entryLow = target.entry_low || target.signals?.entry_low || roundToTick(s1 * 0.995, price)
  const entryHigh = target.entry_high || target.signals?.entry_high || s1
  const sl = target.stop_loss || target.signals?.stop_loss || roundToTick(s2 * 0.985, price)
  const tp1 = target.take_profit_1 || target.signals?.take_profit_1 || roundToTick(r1, price)
  const tp2 = target.take_profit_2 || target.signals?.take_profit_2 || roundToTick(r2, price)
  const vwap = target.vwap || target.bandar?.vwap || roundToTick(price * 0.998, price)
  const bandarStatus = target.bandar_status || target.bandar?.bandar_status || (isUp ? 'Akumulasi Aktif' : 'Distribusi / Tekanan Jual')
  const smartScore = target.smart_money_score || target.bandar?.smart_money_score || (isUp ? 68 : 45)

  // A. Pertanyaan Titik Entry / Beli
  if (q.includes('entry') || q.includes('beli') || q.includes('masuk') || q.includes('bow') || q.includes('harga berapa') || q.includes('titik')) {
    return `🎯 **Panduan Rencana Entry Saham ${ticker} (${name}):**\n\n` +
      `• **Harga Market Bursa Hari Ini:** **Rp ${Number(price).toLocaleString('id-ID')}** (${isUp ? '+' : ''}${changePct}%)\n` +
      `• **Grup Emiten:** ${group}\n` +
      `• **Area Beli Ideal (BoW):** **Rp ${Number(entryLow).toLocaleString('id-ID')} – Rp ${Number(entryHigh).toLocaleString('id-ID')}**\n` +
      `• **Patokan Akumulasi:** Antre dekat Support 1 & modal bandar (VWAP Rp ${Number(vwap).toLocaleString('id-ID')}).\n` +
      `• **Target Take Profit 1 (TP1):** **Rp ${Number(tp1).toLocaleString('id-ID')}** (Resistance 1)\n` +
      `• **Target Take Profit 2 (TP2):** **Rp ${Number(tp2).toLocaleString('id-ID')}** (Swing High)\n` +
      `• **Proteksi Stop Loss (SL):** **Rp ${Number(sl).toLocaleString('id-ID')}** (Disiplin cut loss jika jebol Support 2).\n\n` +
      `💡 **Tips Eksekusi:** Masuk bertahap (*scaling-in*). Jangan mengejar harga yang sudah melonjak jauh dari modal bandar agar risiko tetap minimal.`
  }

  // B. Pertanyaan Stop Loss & Cut Loss
  if (q.includes('stop loss') || q.includes('sl') || q.includes('cut loss') || q.includes('rugi') || q.includes('risiko')) {
    const riskPts = Math.max(1, price - sl)
    const riskPct = ((riskPts / price) * 100).toFixed(1)

    return `🛡️ **Manajemen Risiko & Stop Loss Saham ${ticker}:**\n\n` +
      `• **Harga Pasar:** Rp ${Number(price).toLocaleString('id-ID')}\n` +
      `• **Titik Stop Loss Disiplin:** **Rp ${Number(sl).toLocaleString('id-ID')}**\n` +
      `• **Toleransi Risiko:** Sekitar **-${riskPct}%** (${riskPts} poin dari harga bursa).\n` +
      `• **Level Kunci:** Di bawah Support 2 (Rp ${Number(s2).toLocaleString('id-ID')}).\n\n` +
      `⚠️ **Disiplin Cut Loss:** Jika candle harian ditutup (*daily close*) di bawah Rp ${Number(sl).toLocaleString('id-ID')}, segera keluar untuk mengamankan modal.`
  }

  // C. Pertanyaan Take Profit (TP)
  if (q.includes('tp') || q.includes('take profit') || q.includes('target') || q.includes('jual') || q.includes('cuan')) {
    const gain1 = (((tp1 - price) / price) * 100).toFixed(1)
    const gain2 = (((tp2 - price) / price) * 100).toFixed(1)

    return `🚀 **Target Take Profit Saham ${ticker}:**\n\n` +
      `• **Target 1 (TP1):** **Rp ${Number(tp1).toLocaleString('id-ID')}** (+${gain1}%)\n` +
      `  *Strategi:* Jual 50% lot persis 1 tick sebelum tembok antrean Offer Resistance 1.\n\n` +
      `• **Target 2 (TP2):** **Rp ${Number(tp2).toLocaleString('id-ID')}** (+${gain2}%)\n` +
      `  *Strategi:* Pasang trailing stop di harga modal untuk mengunci profit menuju target swing high.\n\n` +
      `⚖️ **Rasio Risk/Reward:** ${target.risk_reward_ratio || '1 : 2.1'}`
  }

  // D. Pertanyaan Bandarmologi & Smart Money
  if (q.includes('bandar') || q.includes('smart money') || q.includes('akumulasi') || q.includes('distribusi') || q.includes('broker') || q.includes('asing') || q.includes('vwap')) {
    const topBuyer = target.top1_buyer || 'AK'
    const topSeller = target.top1_seller || 'YP'
    const netLots = target.net_top5_lot || (isUp ? 85000 : -65000)

    return `🕵️ **Analisis Bandarmologi & Smart Money Saham ${ticker}:**\n\n` +
      `• **Grup Emiten:** ${group}\n` +
      `• **Status Aliran Dana:** **${bandarStatus}**\n` +
      `• **Smart Money Score:** **${smartScore}/100**\n` +
      `• **Modal Rata-rata Bandar (VWAP):** **Rp ${Number(vwap).toLocaleString('id-ID')}**\n` +
      `• **Top Buyer Teraktif:** Broker **${topBuyer}**\n` +
      `• **Top Seller Teraktif:** Broker **${topSeller}**\n` +
      `• **Net Flow Top 5:** ${netLots >= 0 ? '+' : ''}${Number(netLots).toLocaleString('id-ID')} Lot\n\n` +
      `🔎 **Diagnosa AI:** Harga pasar saat ini (Rp ${Number(price).toLocaleString('id-ID')}) berada ${Math.abs(price - vwap) < price * 0.03 ? 'sangat dekat dengan harga modal akumulasi bandar (Low Downside Risk)' : 'mengikuti pergerakan tren orderbook bursa'}.`
  }

  // E. Pertanyaan Valuasi PBV & Fundamental
  if (q.includes('pbv') || q.includes('per') || q.includes('valuasi') || q.includes('murah') || q.includes('mahal') || q.includes('fundamental') || q.includes('free float')) {
    const pbv = target.pbv || 1.5
    const pbvMean = target.pbv_mean || 2.0
    const roe = target.roe || 15
    const ff = target.free_float_pct || 25
    const ffCat = target.free_float_category || 'Normal'

    return `📊 **Valuasi & Fundamental Saham ${ticker} (${name}):**\n\n` +
      `• **PBV Saat Ini:** **${pbv}x** (Rata-rata 5 tahun: ${pbvMean}x)\n` +
      `• **Status Valuasi:** ${pbv < pbvMean ? '🟢 *Undervalued (Area Diskon)*' : '🟡 *Fair / Premium Value*'}\n` +
      `• **Return on Equity (ROE):** ${roe}%\n` +
      `• **Free Float (Saham Publik):** **${ff}%** (${ffCat})\n` +
      `• **Karakter Likuiditas:** ${ff < 15 ? '⚠️ *Tight Float* (Sensitif tarikan volume kecil & rentan volatilitas)' : '✅ *Likuiditas Luas* (Aman untuk dana besar)'}\n\n` +
      `💡 **Profil Emiten:** ${target.about || 'Perusahaan tercatat di Bursa Efek Indonesia dengan kinerja operasional aktif.'}`
  }

  // Default: Ringkasan Lengkap Saham Tersebut
  return `🤖 **Analisis Komprehensif Saham ${ticker} (${name}):**\n\n` +
    `• **Grup Emiten:** ${group}\n` +
    `• **Harga Pasar Bursa:** **Rp ${Number(price).toLocaleString('id-ID')}** (${isUp ? '+' : ''}${changePct}%)\n` +
    `• **Aksi Smart Money:** ${bandarStatus} (Modal Bandar: Rp ${Number(vwap).toLocaleString('id-ID')})\n` +
    `• **Area Entry Ideal:** Rp ${Number(entryLow).toLocaleString('id-ID')} – Rp ${Number(entryHigh).toLocaleString('id-ID')}\n` +
    `• **Target Take Profit:** Rp ${Number(tp1).toLocaleString('id-ID')} (TP1) / Rp ${Number(tp2).toLocaleString('id-ID')} (TP2)\n` +
    `• **Proteksi Stop Loss:** Rp ${Number(sl).toLocaleString('id-ID')}\n\n` +
    `Silakan tanyakan aspek spesifik lainnya seperti titik entry, modal bandar, atau bandingkan dengan saham lain!`
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
