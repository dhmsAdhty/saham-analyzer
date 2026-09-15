<script setup>
import { computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Target01Icon, CheckmarkCircle01Icon, AlertCircleIcon,
  SparklesIcon, ArrowUp01Icon, ArrowDown01Icon,
  InformationCircleIcon, Coins01Icon
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

// Hitung metrik kesimpulan taktis
const isAccumulating = computed(() => {
  return props.bandar.smartMoneyScore >= 55 || props.bandar.bandarAction.includes('AKUMULASI')
})

const isDistributing = computed(() => {
  return props.bandar.smartMoneyScore < 45 || props.bandar.bandarAction.includes('DISTRIBUSI')
})

const currentPrice = computed(() => props.stock.price)

// Status Rekomendasi Utama
const verdict = computed(() => {
  if (isDistributing.value) {
    return {
      action: 'HINDARI / TUNGGU PULLBACK (AVOID)',
      badgeClass: 'badge-danger',
      bgClass: 'bg-danger-subtle',
      borderClass: 'border-danger',
      icon: AlertCircleIcon,
      accentColor: '#EF4444',
      headline: 'Smart Money / Bandar Terdeteksi Distribusi',
      desc: `Saham ini sedang dalam tekanan jual atau distribusi oleh bandar. Membeli sekarang sangat berisiko terkena bantingan harga. Jangan kejar harga (FOMO), tunggu konfirmasi pantulan baru.`
    }
  } else if (isAccumulating.value && props.analysis.rsi <= 65) {
    return {
      action: 'SIAP ENTRY (ACCUMULATION BUY)',
      badgeClass: 'badge-success',
      bgClass: 'bg-success-subtle',
      borderClass: 'border-success',
      icon: CheckmarkCircle01Icon,
      accentColor: '#10B981',
      headline: 'Konfluensi Positif: Bandar Akumulasi & Tren Terjaga',
      desc: `Smart money terbukti aktif menyerap pasokan barang di harga modal Rp ${Number(props.bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID')}. Struktur teknikal mendukung peluang pantulan naik menuju target Take Profit.`
    }
  } else {
    return {
      action: 'BUY ON WEAKNESS (ANTRE DI SUPPORT)',
      badgeClass: 'badge-warning',
      bgClass: 'bg-warning-subtle',
      borderClass: 'border-warning',
      icon: SparklesIcon,
      accentColor: '#F59E0B',
      headline: 'Pantau Disiplin di Area Support',
      desc: `Kekuatan beli dan jual relatif seimbang. Disarankan hanya membeli jika harga terkoreksi ke batas bawah area Entry dekat Support 1, jangan membeli di pucuk resistance.`
    }
  }
})

// Kalkulasi nominal rupiah risiko & potensi profit
const entryMid = computed(() => Math.round((props.analysis.entryBuyLow + props.analysis.entryBuyHigh) / 2))
const riskPoints = computed(() => Math.max(1, entryMid.value - props.analysis.stopLoss))
const rewardPoints = computed(() => Math.max(1, props.analysis.takeProfit1 - entryMid.value))
const riskPct = computed(() => ((riskPoints.value / entryMid.value) * 100).toFixed(1))
const rewardPct = computed(() => ((rewardPoints.value / entryMid.value) * 100).toFixed(1))
const rrrRatio = computed(() => (rewardPoints.value / riskPoints.value).toFixed(1))
</script>

<template>
  <div class="decision-card" :class="verdict.borderClass">
    <!-- Header Keputusan -->
    <div class="decision-header" :class="verdict.bgClass">
      <div class="header-left">
        <div class="action-pill" :style="{ background: verdict.accentColor }">
          <HugeiconsIcon :icon="verdict.icon" :size="16" style="color: #0F172A;" />
          <span>{{ verdict.action }}</span>
        </div>
        <div class="headline-text">
          <h4>{{ verdict.headline }}</h4>
          <p>{{ verdict.desc }}</p>
        </div>
      </div>

      <!-- Skor Ringkas -->
      <div class="header-right">
        <div class="stat-pill font-mono">
          <span class="lbl">Risk/Reward</span>
          <b class="val">1 : {{ rrrRatio }}</b>
        </div>
        <div class="stat-pill font-mono">
          <span class="lbl">Modal Bandar</span>
          <b class="val" style="color: #38BDF8;">Rp {{ Number(bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}</b>
        </div>
      </div>
    </div>

    <!-- 3 Box Inti: HARGA ENTRY, STOP LOSS, TAKE PROFIT -->
    <div class="decision-boxes-grid">
      <!-- 1. ENTRY BOX -->
      <div class="plan-box entry-box">
        <div class="plan-head">
          <div class="badge-plan entry">Rekomendasi Beli</div>
          <span class="sub-label">Harga Masuk</span>
        </div>
        <div class="price-hero font-mono">
          Rp {{ Number(analysis.entryBuyLow).toLocaleString('id-ID') }} – {{ Number(analysis.entryBuyHigh).toLocaleString('id-ID') }}
        </div>
        <div class="plan-footer">
          <div class="rule-row">
            <span class="k">Strategi:</span>
            <b class="v">Buy on Weakness (BoW)</b>
          </div>
          <div class="rule-row">
            <span class="k">Patokan Entry:</span>
            <span class="v">Dekat Support 1 (Rp {{ Number(analysis.support1).toLocaleString('id-ID') }})</span>
          </div>
          <div class="rule-hint">
            💡 Masuk bertahap saat harga menguji area modal bandar.
          </div>
        </div>
      </div>

      <!-- 2. STOP LOSS (SL) BOX -->
      <div class="plan-box sl-box">
        <div class="plan-head">
          <div class="badge-plan sl">Proteksi Modal</div>
          <span class="sub-label">Wajib Cut Loss (SL)</span>
        </div>
        <div class="price-hero font-mono" style="color: #EF4444;">
          Rp {{ Number(analysis.stopLoss).toLocaleString('id-ID') }}
        </div>
        <div class="plan-footer">
          <div class="rule-row">
            <span class="k">Toleransi Risiko:</span>
            <b class="v font-mono" style="color: #EF4444;">-{{ riskPct }}% ({{ riskPoints }} poin)</b>
          </div>
          <div class="rule-row">
            <span class="k">Batas Jebol:</span>
            <span class="v">Di bawah Support 2 (Rp {{ Number(analysis.support2).toLocaleString('id-ID') }})</span>
          </div>
          <div class="rule-hint" style="color: #F87171;">
            ⚠️ Wajib disiplin keluar (OUT) jika candle closing harian tembus level ini.
          </div>
        </div>
      </div>

      <!-- 3. TAKE PROFIT (TP) BOX -->
      <div class="plan-box tp-box">
        <div class="plan-head">
          <div class="badge-plan tp">Target Profit</div>
          <span class="sub-label">Ambil Untung (TP)</span>
        </div>
        <div class="price-hero font-mono" style="color: #10B981;">
          Rp {{ Number(analysis.takeProfit1).toLocaleString('id-ID') }} <small style="font-size: 13px; color: #94A3B8;">(TP1)</small>
        </div>
        <div class="plan-footer">
          <div class="rule-row">
            <span class="k">Target TP2:</span>
            <b class="v font-mono" style="color: #34D399;">Rp {{ Number(analysis.takeProfit2).toLocaleString('id-ID') }}</b>
          </div>
          <div class="rule-row">
            <span class="k">Potensi Cuan:</span>
            <b class="v font-mono" style="color: #10B981;">+{{ rewardPct }}% ({{ rewardPoints }} poin)</b>
          </div>
          <div class="rule-hint" style="color: #34D399;">
            🎯 Jual 50% lot di TP1 (Resistance 1), sisanya pasang trailing stop ke TP2.
          </div>
        </div>
      </div>
    </div>

    <!-- Ringkasan Alasan Mengapa Keputusan Ini Dibuat -->
    <div class="decision-reasons-bar">
      <div class="reason-title">
        <HugeiconsIcon :icon="InformationCircleIcon" :size="15" style="color: #38BDF8;" />
        <b>Alasan Penetapan Level Entry & Out:</b>
      </div>
      <div class="reason-bullets">
        <div class="r-item">
          <span class="dot"></span>
          <span><b>Kondisi Smart Money:</b> Status saat ini <u>{{ bandar.bandarStatus }}</u> dengan skor <u>{{ bandar.smartMoneyScore }}/100</u>. Harga modal institusi berada di level Rp {{ Number(bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}.</span>
        </div>
        <div class="r-item">
          <span class="dot"></span>
          <span><b>Struktur Teknikal & Volatilitas:</b> Buffer risiko dihitung berdasarkan Average True Range (ATR: {{ analysis.atr }} pt), menjaga Stop Loss dari gocekan candle harian normal.</span>
        </div>
        <div class="r-item">
          <span class="dot"></span>
          <span><b>Rasio Peluang (Risk to Reward):</b> Potensi keuntungan (+{{ rewardPct }}%) jauh lebih besar daripada risiko kerugian (-{{ riskPct }}%), memberikan ekspektasi positif jangka panjang.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.decision-card {
  background: #111827;
  border-radius: 16px;
  border: 1px solid #1F2937;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
}

.decision-card.border-success { border-color: rgba(16, 185, 129, 0.4); }
.decision-card.border-danger { border-color: rgba(239, 68, 68, 0.4); }
.decision-card.border-warning { border-color: rgba(245, 158, 11, 0.4); }

.decision-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid #1F2937;
}

.decision-header.bg-success-subtle { background: rgba(16, 185, 129, 0.08); }
.decision-header.bg-danger-subtle { background: rgba(239, 68, 68, 0.08); }
.decision-header.bg-warning-subtle { background: rgba(245, 158, 11, 0.08); }

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.action-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.headline-text h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #F8FAFC;
}
.headline-text p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94A3B8;
  max-width: 600px;
  line-height: 1.4;
}

.header-right {
  display: flex;
  gap: 10px;
}

.stat-pill {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 8px;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
}
.stat-pill .lbl {
  font-size: 10px;
  color: #64748B;
  text-transform: uppercase;
}
.stat-pill .val {
  font-size: 13px;
  color: #F8FAFC;
}

/* 3 Kolom Grid Box */
.decision-boxes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
}

.plan-box {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease;
}
.plan-box:hover {
  transform: translateY(-2px);
}

.entry-box { border-top: 4px solid #F59E0B; }
.sl-box { border-top: 4px solid #EF4444; }
.tp-box { border-top: 4px solid #10B981; }

.plan-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.badge-plan {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}
.badge-plan.entry { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
.badge-plan.sl { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
.badge-plan.tp { background: rgba(16, 185, 129, 0.15); color: #10B981; }

.sub-label {
  font-size: 11px;
  color: #64748B;
}

.price-hero {
  font-size: 20px;
  font-weight: 800;
  color: #F8FAFC;
  margin-bottom: 12px;
}

.plan-footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11.5px;
  border-top: 1px solid #1E293B;
  padding-top: 10px;
}

.rule-row {
  display: flex;
  justify-content: space-between;
  color: #94A3B8;
}
.rule-row .v {
  color: #E2E8F0;
}

.rule-hint {
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.4;
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 8px;
  border-radius: 6px;
}

/* Reason Bar */
.decision-reasons-bar {
  background: #0B0F19;
  border-top: 1px solid #1F2937;
  padding: 14px 20px;
  font-size: 12px;
}

.reason-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #CBD5E1;
  margin-bottom: 8px;
}

.reason-bullets {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.r-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #94A3B8;
  line-height: 1.4;
}
.r-item .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #38BDF8;
  flex: none;
}
.r-item u {
  text-decoration: none;
  color: #F8FAFC;
  font-weight: 600;
}

@media (max-width: 880px) {
  .decision-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px;
    gap: 12px;
  }
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .header-right {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .stat-pill {
    padding: 6px 10px;
  }
  .decision-boxes-grid {
    grid-template-columns: 1fr;
    padding: 14px;
    gap: 12px;
  }
  .decision-reasons-bar {
    padding: 12px 14px;
  }
}
</style>
