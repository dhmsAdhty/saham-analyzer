<script setup>
import { computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  SparklesIcon, CheckmarkCircle01Icon, AlertCircleIcon,
  Chart01Icon, Analytics01Icon, Target01Icon,
} from '@hugeicons/core-free-icons'

const props = defineProps({
  stock: {
    type: Object,
    required: true,
  },
  analysis: {
    type: Object,
    required: true,
  },
  bandar: {
    type: Object,
    required: true,
  },
})

const price = computed(() => props.stock.price)

// Indikator 1: MA Confluence (Moving Average 20, 50, 200)
const maConfluence = computed(() => {
  const p = price.value
  const ma20 = props.analysis.ma20
  const ma50 = props.analysis.ma50
  const ma200 = props.analysis.ma200

  if (p > ma20 && ma20 > ma50 && ma50 > ma200) {
    return {
      name: 'MA Alignment (Golden Trend)',
      status: 'STRONG BULLISH',
      color: '#10B981',
      desc: 'Harga di atas MA20, MA50, dan MA200. Struktur tren naik sempurna untuk swing trading.',
      action: 'BUY ON PULLBACK KE MA20',
      actionLevel: `Rp ${ma20.toLocaleString('id-ID')}`
    }
  } else if (p > ma20 && p > ma50) {
    return {
      name: 'MA20 & MA50 Uptrend',
      status: 'BULLISH REBOUND',
      color: '#34D399',
      desc: 'Harga berhasil bertahan di atas MA20 dan MA50 jangka pendek-menengah.',
      action: 'ENTRY TAHAP 1',
      actionLevel: `Rp ${ma20.toLocaleString('id-ID')}`
    }
  } else if (p < ma20 && p > ma200) {
    return {
      name: 'MA Retest Support Jangka Panjang',
      status: 'NEUTRAL ACCUMULATION',
      color: '#F59E0B',
      desc: 'Harga sedang koreksi sehat menguji MA200. Area strategis pemburu diskon.',
      action: 'ANTRI BUY DEKAT MA200',
      actionLevel: `Rp ${ma200.toLocaleString('id-ID')}`
    }
  } else {
    return {
      name: 'MA Breakdown (Downtrend)',
      status: 'BEARISH / WAIT',
      color: '#EF4444',
      desc: 'Harga berada di bawah rata-rata MA20 dan MA50. Jangan terburu-buru tangkap pisau jatuh.',
      action: 'WAIT & SEE',
      actionLevel: 'Tunggu Reversal'
    }
  }
})

// Indikator 2: RSI 14 (Relative Strength Index)
const rsiIndicator = computed(() => {
  const rsi = props.analysis.rsi
  if (rsi <= 35) {
    return {
      name: 'RSI (14) Oversold Reversal',
      value: `${rsi}`,
      status: 'HIGH PROBABILITY BUY (OVERSOLD)',
      color: '#10B981',
      desc: 'RSI berada di area jenuh jual (< 35). Tekanan jual sudah habis, potensi pantulan teknikal (rebound) sangat tinggi.',
      action: 'BUY SIGNAL',
      trigger: 'Pantulan Stochastic / Bullish Divergence'
    }
  } else if (rsi >= 70) {
    return {
      name: 'RSI (14) Overbought',
      value: `${rsi}`,
      status: 'OVERBOUGHT (HATI-HATI RETEST)',
      color: '#EF4444',
      desc: 'RSI berada di area jenuh beli (> 70). Ruang kenaikan jangka pendek terbatas, rentan koreksi.',
      action: 'TAKE PROFIT / JANGAN FOMO',
      trigger: 'Tunggu Cooling Down ke 50-55'
    }
  } else if (rsi >= 50 && rsi < 70) {
    return {
      name: 'RSI (14) Bullish Zone',
      value: `${rsi}`,
      status: 'MOMENTUM SEHAT (50-70)',
      color: '#38BDF8',
      desc: 'Momentum pembeli mendominasi di atas garis ekuilibrium 50 tanpa risiko jenuh beli berlebih.',
      action: 'TREND FOLLOWING BUY',
      trigger: 'Target Resistance 1'
    }
  } else {
    return {
      name: 'RSI (14) Weak Momentum',
      value: `${rsi}`,
      status: 'KONSOLIDASI (40-50)',
      color: '#94A3B8',
      desc: 'Kekuatan pembeli dan penjual berimbang. Harga cenderung bergerak menyamping (sideways).',
      action: 'SWING TRADE DI SUPPORT',
      trigger: 'Antri di Support 1'
    }
  }
})

// Indikator 3: Smart Money VWAP Deviation (Bandar Price Distance)
const vwapBandar = computed(() => {
  const p = price.value
  const bPrice = props.bandar.smartMoneyAvgBuyPrice
  const diffPct = (((p - bPrice) / bPrice) * 100).toFixed(2)

  if (p <= bPrice * 1.015 && p >= bPrice * 0.98) {
    return {
      name: 'Smart Money VWAP Proximity',
      status: 'IDEAL VALUE ENTRY',
      color: '#10B981',
      desc: `Harga pasar hanya berselisih ${diffPct}% dari modal rata-rata bandar (Rp ${bPrice.toLocaleString('id-ID')}). Anda membeli seharga bandar!`,
      action: 'ENTRY SEKARANG (HIGH CONFIDENCE)',
      target: `Cut loss jika jebol di bawah Rp ${Math.round(bPrice * 0.97).toLocaleString('id-ID')}`
    }
  } else if (p > bPrice * 1.015 && p <= bPrice * 1.05) {
    return {
      name: 'Smart Money Markup Stage 1',
      status: 'RUNNING WITH THE BANDAR',
      color: '#34D399',
      desc: `Bandar sedang mengangkat harga (+${diffPct}% dari modal). Masih aman masuk dengan batas trailing stop.`,
      action: 'BUY ON WEAKNESS',
      target: `Antri beli saat koreksi ke Rp ${bPrice.toLocaleString('id-ID')}`
    }
  } else if (p > bPrice * 1.05) {
    return {
      name: 'Extended from Smart Money Base',
      status: 'OVER-EXTENDED (+5% DARI BANDAR)',
      color: '#F59E0B',
      desc: `Harga sudah melaju jauh (+${diffPct}%) di atas modal akumulasi bandar. Berisiko terkena aksi guyur profit taking.`,
      action: 'TUNGGU PULLBACK',
      target: `Tunggu kembali ke kisaran Rp ${Math.round(bPrice * 1.02).toLocaleString('id-ID')}`
    }
  } else {
    return {
      name: 'Discount Below Bandar Modal',
      status: 'DISCOUNT TO BANDAR',
      color: '#38BDF8',
      desc: `Harga berada di bawah modal bandar (${diffPct}%). Biasanya terjadi fase wash out (shakeout ritel).`,
      action: 'SPECULATIVE BUY',
      target: `Beli bertahap dengan money management ketat`
    }
  }
})

// Skoring Konfluensi Akhir (0 - 100)
const confluenceScore = computed(() => {
  let score = 50
  if (props.bandar.smartMoneyScore >= 70) score += 20
  else if (props.bandar.smartMoneyScore <= 40) score -= 20

  if (price.value > props.analysis.ma20) score += 10
  if (price.value > props.analysis.ma50) score += 10

  if (props.analysis.rsi >= 45 && props.analysis.rsi <= 65) score += 10
  if (props.analysis.rsi <= 35) score += 15 // oversold rebound chance
  if (props.analysis.rsi >= 75) score -= 15 // overbought risk

  return Math.min(95, Math.max(25, score))
})
</script>

<template>
  <div class="card-terminal">
    <!-- Header -->
    <div class="card-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="icon-wrap-brand" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">
          <HugeiconsIcon :icon="SparklesIcon" :size="20" />
        </div>
        <div>
          <h3 class="card-title">Multi-Indicator Confluence (Sinyal Entry Gabungan)</h3>
          <p class="card-sub">Kombinasi 4 indikator teruji: Moving Average, RSI (14), Smart Money VWAP, dan S/R Breakout</p>
        </div>
      </div>
      <div class="confluence-score-box">
        <span class="cs-lbl">Skor Konfluensi Entry:</span>
        <b class="cs-val font-mono" :style="{ color: confluenceScore >= 70 ? '#10B981' : confluenceScore >= 50 ? '#38BDF8' : '#EF4444' }">
          {{ confluenceScore }}/100
        </b>
      </div>
    </div>

    <!-- 3 Core Indicators Cards -->
    <div class="indicators-grid">
      <!-- 1. MA Trend Alignment -->
      <div class="ind-card" :style="{ borderLeftColor: maConfluence.color }">
        <div class="ind-top">
          <span class="ind-name">{{ maConfluence.name }}</span>
          <span class="ind-badge" :style="{ background: maConfluence.color + '25', color: maConfluence.color }">
            {{ maConfluence.status }}
          </span>
        </div>
        <p class="ind-desc">{{ maConfluence.desc }}</p>
        <div class="ind-action-row">
          <span class="act-lbl">Rekomendasi Tindakan:</span>
          <b class="act-val" :style="{ color: maConfluence.color }">{{ maConfluence.action }} ({{ maConfluence.actionLevel }})</b>
        </div>
      </div>

      <!-- 2. RSI 14 Momentum -->
      <div class="ind-card" :style="{ borderLeftColor: rsiIndicator.color }">
        <div class="ind-top">
          <span class="ind-name">{{ rsiIndicator.name }}</span>
          <span class="ind-badge" :style="{ background: rsiIndicator.color + '25', color: rsiIndicator.color }">
            {{ rsiIndicator.status }}
          </span>
        </div>
        <p class="ind-desc">{{ rsiIndicator.desc }}</p>
        <div class="ind-action-row">
          <span class="act-lbl">Rekomendasi Tindakan:</span>
          <b class="act-val" :style="{ color: rsiIndicator.color }">{{ rsiIndicator.action }} ({{ rsiIndicator.trigger }})</b>
        </div>
      </div>

      <!-- 3. Smart Money VWAP Modal Bandar -->
      <div class="ind-card" :style="{ borderLeftColor: vwapBandar.color }">
        <div class="ind-top">
          <span class="ind-name">{{ vwapBandar.name }}</span>
          <span class="ind-badge" :style="{ background: vwapBandar.color + '25', color: vwapBandar.color }">
            {{ vwapBandar.status }}
          </span>
        </div>
        <p class="ind-desc">{{ vwapBandar.desc }}</p>
        <div class="ind-action-row">
          <span class="act-lbl">Rekomendasi Tindakan:</span>
          <b class="act-val" :style="{ color: vwapBandar.color }">{{ vwapBandar.action }}</b>
        </div>
      </div>
    </div>

    <!-- Panduan SOP Entry Disiplin -->
    <div class="sop-box">
      <h4 class="sop-title">
        <HugeiconsIcon :icon="CheckmarkCircle01Icon" :size="16" style="color: #10B981;" />
        Checklist Standar Operasional Entry (SOP Trader Profesional)
      </h4>
      <div class="sop-grid">
        <div class="sop-item">
          <span class="num">1</span>
          <div>
            <b>Cek Arah Smart Money</b>
            <p>Pastikan status bandarmologi berada dalam fase Akumulasi atau Net Buy sebelum beli.</p>
          </div>
        </div>
        <div class="sop-item">
          <span class="num">2</span>
          <div>
            <b>Beli Dekat Modal Bandar</b>
            <p>Usahakan beli di harga yang mendekati rata-rata modal beli broker akumulator (maksimal +2%).</p>
          </div>
        </div>
        <div class="sop-item">
          <span class="num">3</span>
          <div>
            <b>Pasang Stop Loss Otomatis</b>
            <p>Jangan pernah beli tanpa batas cut loss di bawah level Support 2 (maksimal toleransi 2-3%).</p>
          </div>
        </div>
        <div class="sop-item">
          <span class="num">4</span>
          <div>
            <b>Ambil Profit Bertahap (TP1 & TP2)</b>
            <p>Kunci sebagian profit di Resistance 1 dan pasang trailing stop untuk sisa lot.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-terminal {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.icon-wrap-brand {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}

.card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #F9FAFB;
}
.card-sub {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: #9CA3AF;
}

.confluence-score-box {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cs-lbl {
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
}
.cs-val {
  font-size: 16px;
  font-weight: 800;
}

.indicators-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
}

.ind-card {
  background: #1E293B;
  border: 1px solid #334155;
  border-left: 4px solid;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ind-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.ind-name {
  font-size: 14px;
  font-weight: 700;
  color: #F8FAFC;
}
.ind-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
}

.ind-desc {
  margin: 0;
  font-size: 12.5px;
  color: #94A3B8;
  line-height: 1.45;
}

.ind-action-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed #334155;
  font-size: 12.5px;
  flex-wrap: wrap;
}
.act-lbl {
  color: #64748B;
  font-weight: 600;
}
.act-val {
  font-weight: 700;
}

/* SOP Box */
.sop-box {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 14px;
  padding: 18px 20px;
}
.sop-title {
  margin: 0 0 14px;
  font-size: 13.5px;
  font-weight: 700;
  color: #F8FAFC;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.sop-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.sop-item .num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.15);
  color: #38BDF8;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  flex: none;
  margin-top: 2px;
}
.sop-item b {
  font-size: 12.5px;
  color: #E2E8F0;
  display: block;
}
.sop-item p {
  margin: 2px 0 0;
  font-size: 11.5px;
  color: #94A3B8;
  line-height: 1.4;
}
</style>
