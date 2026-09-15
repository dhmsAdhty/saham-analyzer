<script setup>
import { computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Chart01Icon, Analytics01Icon, Coins01Icon,
  PieChart01Icon, InformationCircleIcon,
  CheckmarkCircle01Icon, AlertCircleIcon,
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
})

// Format Rupiah Triliun/Miliar
const formatMarketCap = (val) => {
  if (val >= 1e12) return `Rp ${(val / 1e12).toFixed(1)} Triliun`
  if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)} Miliar`
  return `Rp ${Number(val).toLocaleString('id-ID')}`
}

// PBV Gauge Position Percentage (Clamped 0% to 100%)
const pbvGaugePct = computed(() => {
  const min = props.stock.pbvMinus1SD * 0.8
  const max = props.stock.pbvPlus1SD * 1.2
  const current = props.stock.pbv
  const pct = ((current - min) / (max - min)) * 100
  return Math.min(100, Math.max(5, Math.round(pct)))
})
</script>

<template>
  <div class="card-terminal">
    <!-- Header -->
    <div class="card-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="icon-wrap-brand" style="background: rgba(16, 185, 129, 0.12); color: #10B981;">
          <HugeiconsIcon :icon="Analytics01Icon" :size="20" />
        </div>
        <div>
          <h3 class="card-title">Matriks Valuasi PBV & Struktur Free Float</h3>
          <p class="card-sub">Analisis nilai wajar berbasis aset dan likuiditas kepemilikan publik</p>
        </div>
      </div>
      <span class="badge-status font-mono">
        KATEGORI: {{ stock.marketCapTier }}
      </span>
    </div>

    <!-- 2 Column Breakdown: PBV Band vs Free Float Analysis -->
    <div class="val-grid">
      <!-- 1. PBV Historical Band Analysis -->
      <div class="sub-panel">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <span class="sub-panel-title">Valuasi PBV (Price to Book Value)</span>
          <span :style="{ color: analysis.pbvColor }" class="status-tag">
            {{ analysis.pbvStatus }}
          </span>
        </div>

        <!-- Current PBV Stat -->
        <div class="pbv-hero">
          <span class="pbv-number font-mono">{{ stock.pbv }}x</span>
          <div class="pbv-details">
            <span>Nilai Buku Bersih (BVPS): <b class="font-mono">Rp {{ Number(stock.bvps).toLocaleString('id-ID') }}</b></span>
            <span>Rata-rata Historis 5 Th: <b class="font-mono">{{ stock.pbvMean }}x</b></span>
          </div>
        </div>

        <!-- PBV Visual Band Gauge -->
        <div class="gauge-wrap">
          <div class="gauge-labels">
            <span>-1 SD (Diskon): {{ stock.pbvMinus1SD }}x</span>
            <span>Mean (Wajar): {{ stock.pbvMean }}x</span>
            <span>+1 SD (Premium): {{ stock.pbvPlus1SD }}x</span>
          </div>
          <div class="gauge-track">
            <!-- Diskon Zone -->
            <div class="zone green" style="width: 35%;"></div>
            <!-- Wajar Zone -->
            <div class="zone blue" style="width: 35%;"></div>
            <!-- Mahal Zone -->
            <div class="zone red" style="width: 30%;"></div>
            <!-- Indicator Pin -->
            <div class="gauge-pin" :style="{ left: pbvGaugePct + '%' }"></div>
          </div>
        </div>

        <p class="analysis-explanation">
          {{ analysis.pbvDesc }}
        </p>
      </div>

      <!-- 2. Free Float Structure & Volatility -->
      <div class="sub-panel">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <span class="sub-panel-title">Struktur Saham Publik (Free Float)</span>
          <span :style="{ color: analysis.ffColor }" class="status-tag">
            {{ analysis.ffLevel }}
          </span>
        </div>

        <!-- Free Float Hero -->
        <div class="pbv-hero">
          <span class="pbv-number font-mono" :style="{ color: analysis.ffColor }">
            {{ stock.freeFloatPct }}%
          </span>
          <div class="pbv-details">
            <span>Total Saham Beredar: <b class="font-mono">{{ stock.sharesOutstanding }}</b></span>
            <span>Kategori BEI: <b class="font-mono">{{ stock.freeFloatCategory }}</b></span>
          </div>
        </div>

        <!-- Free Float Progress Bar -->
        <div class="gauge-wrap">
          <div class="gauge-labels">
            <span>0% (Sangat Ketat)</span>
            <span>Standar Bursa (15% - 40%)</span>
            <span>100% (Publik)</span>
          </div>
          <div class="gauge-track">
            <div
              class="ff-fill"
              :style="{ width: stock.freeFloatPct + '%', background: analysis.ffColor }"
            ></div>
          </div>
        </div>

        <p class="analysis-explanation">
          {{ analysis.ffRecommendation }}
        </p>
      </div>
    </div>

    <!-- Fundamental Ratios Matrix Grid -->
    <div class="ratios-grid">
      <div class="ratio-card">
        <span class="r-lbl">P/E Ratio (PER)</span>
        <b class="r-val font-mono">{{ stock.peRatio }}x</b>
        <small class="r-sub">{{ stock.peRatio > 0 ? 'Valuasi laba bersih' : 'Laba negatif' }}</small>
      </div>

      <div class="ratio-card">
        <span class="r-lbl">Return on Equity (ROE)</span>
        <b class="r-val font-mono" :style="{ color: stock.roe >= 15 ? '#10B981' : '#F8FAFC' }">
          {{ stock.roe }}%
        </b>
        <small class="r-sub">Efektivitas laba atas modal</small>
      </div>

      <div class="ratio-card">
        <span class="r-lbl">Debt to Equity (DER)</span>
        <b class="r-val font-mono" :style="{ color: stock.der <= 1.0 ? '#10B981' : '#F59E0B' }">
          {{ stock.der }}x
        </b>
        <small class="r-sub">Rasio beban utang terhadap ekuitas</small>
      </div>

      <div class="ratio-card">
        <span class="r-lbl">Dividend Yield</span>
        <b class="r-val font-mono" style="color: #38BDF8;">
          {{ stock.dividendYield }}%
        </b>
        <small class="r-sub">Imbal hasil dividen tahunan</small>
      </div>

      <div class="ratio-card">
        <span class="r-lbl">Kapitalisasi Pasar</span>
        <b class="r-val font-mono" style="font-size: 13.5px;">
          {{ formatMarketCap(stock.marketCap) }}
        </b>
        <small class="r-sub">{{ stock.sector }}</small>
      </div>

      <div class="ratio-card">
        <span class="r-lbl">RSI (14) Momentum</span>
        <b class="r-val font-mono" :style="{ color: analysis.rsi >= 70 ? '#EF4444' : analysis.rsi <= 30 ? '#10B981' : '#F8FAFC' }">
          {{ analysis.rsi }}
        </b>
        <small class="r-sub">{{ analysis.rsi >= 70 ? 'Overbought' : analysis.rsi <= 30 ? 'Oversold' : 'Zona Netral' }}</small>
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

.badge-status {
  background: rgba(255, 255, 255, 0.08);
  color: #F3F4F6;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
}

.val-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.sub-panel {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
}

.sub-panel-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #F8FAFC;
}

.status-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
}

.pbv-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0 14px;
}

.pbv-number {
  font-size: 28px;
  font-weight: 800;
  color: #F8FAFC;
  letter-spacing: -0.02em;
}

.pbv-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #94A3B8;
}
.pbv-details b {
  color: #E2E8F0;
}

.gauge-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}
.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #94A3B8;
  font-family: 'JetBrains Mono', monospace;
}

.gauge-track {
  height: 10px;
  border-radius: 9999px;
  background: #0F172A;
  display: flex;
  position: relative;
  overflow: hidden;
}
.zone.green { background: rgba(16, 185, 129, 0.6); }
.zone.blue { background: rgba(56, 189, 248, 0.6); }
.zone.red { background: rgba(239, 68, 68, 0.6); }

.gauge-pin {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #FFFFFF;
  box-shadow: 0 0 6px #FFFFFF;
  transform: translateX(-50%);
}

.ff-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.analysis-explanation {
  font-size: 12.5px;
  color: #94A3B8;
  line-height: 1.45;
  margin: 0;
}

/* Ratios Grid */
.ratios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.ratio-card {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

.r-lbl {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
}
.r-val {
  font-size: 17px;
  color: #F8FAFC;
  margin-top: 4px;
}
.r-sub {
  font-size: 11px;
  color: #64748B;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .val-grid { grid-template-columns: 1fr; }
}
</style>
