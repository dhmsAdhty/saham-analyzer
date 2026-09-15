<script setup>
import { ref, computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Target01Icon, AlertCircleIcon, Tick01Icon,
  Coins01Icon, ArrowUp01Icon, ArrowDown01Icon,
  Calculator01Icon, InformationCircleIcon,
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

// Interactive Money Management & Lot Sizing Calculator
const capital = ref(10000000) // Default 10 juta
const riskTolerancePct = ref(2) // Default max 2% risk of total capital

const currentPrice = computed(() => props.stock.price)

// Active strategy calculation
const activeStrategy = computed(() => props.analysis.recommendations[0]) // Buy on Weakness

const maxRiskRp = computed(() => Math.round((capital.value * riskTolerancePct.value) / 100))

// Risk per share = Entry Price - Stop Loss
const riskPerShare = computed(() => {
  const risk = activeStrategy.value.entryIdeal - activeStrategy.value.stopLoss
  return risk > 0 ? risk : Math.round(currentPrice.value * 0.03)
})

// Lot sizing calculation (1 lot = 100 shares)
const recommendedLots = computed(() => {
  if (riskPerShare.value <= 0) return 1
  const shares = Math.floor(maxRiskRp.value / riskPerShare.value)
  const lots = Math.floor(shares / 100)
  
  // Guard agar modal terpakai tidak melebihi modal total
  const cost = lots * 100 * activeStrategy.value.entryIdeal
  if (cost > capital.value) {
    return Math.max(1, Math.floor(capital.value / (100 * activeStrategy.value.entryIdeal)))
  }
  return Math.max(1, lots)
})

const totalInvested = computed(() => recommendedLots.value * 100 * activeStrategy.value.entryIdeal)
const actualRiskRp = computed(() => recommendedLots.value * 100 * riskPerShare.value)
const potentialGainRp = computed(() => {
  const gainPerShare = activeStrategy.value.targetPrice1 - activeStrategy.value.entryIdeal
  return recommendedLots.value * 100 * gainPerShare
})
</script>

<template>
  <div class="card-terminal">
    <!-- Header Section -->
    <div class="card-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="icon-wrap-brand">
          <HugeiconsIcon :icon="Target01Icon" :size="20" />
        </div>
        <div>
          <h3 class="card-title">Kalkulator Posisi Entry & Risk/Reward</h3>
          <p class="card-sub">Panduan harga masuk (entry), stop loss, dan target profit berbasis analisis teknikal</p>
        </div>
      </div>
      <span class="badge-status font-mono">
        HARGA KINI: Rp {{ Number(stock.price).toLocaleString('id-ID') }}
      </span>
    </div>

    <!-- Strategy Cards Grid -->
    <div class="strategy-grid">
      <div
        v-for="(strat, idx) in analysis.recommendations"
        :key="idx"
        class="strategy-card"
        :class="{ recommended: idx === 0 }"
      >
        <div class="strat-head">
          <span class="strat-title">{{ strat.strategy }}</span>
          <span :class="['badge-pill', strat.badgeClass]">{{ strat.badge }}</span>
        </div>

        <p class="strat-rationale">{{ strat.rationale }}</p>

        <!-- Price Levels Grid -->
        <div class="price-levels-grid">
          <div class="price-box entry">
            <span class="lbl">Area Entry (Beli)</span>
            <b class="val font-mono">Rp {{ strat.entryRange }}</b>
            <small class="sub">Harga ideal: Rp {{ Number(strat.entryIdeal).toLocaleString('id-ID') }}</small>
          </div>

          <div class="price-box sl">
            <span class="lbl">Stop Loss (Batas Risiko)</span>
            <b class="val font-mono" style="color: #EF4444;">Rp {{ Number(strat.stopLoss).toLocaleString('id-ID') }}</b>
            <small class="sub" style="color: #F87171;">-{{ strat.riskPct }}% (-{{ Number(strat.riskPoints).toLocaleString('id-ID') }} pts)</small>
          </div>

          <div class="price-box tp">
            <span class="lbl">Target Profit 1 (TP1)</span>
            <b class="val font-mono" style="color: #10B981;">Rp {{ Number(strat.targetPrice1).toLocaleString('id-ID') }}</b>
            <small class="sub" style="color: #34D399;">+{{ strat.potentialGainPct }}% (S/R R1)</small>
          </div>

          <div class="price-box tp">
            <span class="lbl">Target Profit 2 (TP2)</span>
            <b class="val font-mono" style="color: #10B981;">Rp {{ Number(strat.targetPrice2).toLocaleString('id-ID') }}</b>
            <small class="sub" style="color: #34D399;">S/R R2 Level</small>
          </div>
        </div>

        <div class="strat-footer">
          <span>Risk / Reward Ratio: <b class="font-mono" style="color: #38BDF8;">{{ strat.rrRatio }}</b></span>
          <span style="color: #94A3B8; font-size: 11.5px;">Cocok untuk Swing 1-3 Minggu</span>
        </div>
      </div>
    </div>

    <!-- Technical Levels Visual Ladder -->
    <div class="ladder-section">
      <h4 class="ladder-title">Key Technical Levels (Pivot Point & Support/Resistance)</h4>
      <div class="ladder-row">
        <div class="ladder-box r2">
          <span class="ladder-lbl">R2 (Resistance Kuat)</span>
          <b class="ladder-val font-mono">Rp {{ Number(analysis.resistance2).toLocaleString('id-ID') }}</b>
        </div>
        <div class="ladder-box r1">
          <span class="ladder-lbl">R1 (Target TP1)</span>
          <b class="ladder-val font-mono">Rp {{ Number(analysis.resistance1).toLocaleString('id-ID') }}</b>
        </div>
        <div class="ladder-box pivot">
          <span class="ladder-lbl">Pivot Median</span>
          <b class="ladder-val font-mono">Rp {{ Number(analysis.pivot).toLocaleString('id-ID') }}</b>
        </div>
        <div class="ladder-box s1">
          <span class="ladder-lbl">S1 (Area Pantulan BoW)</span>
          <b class="ladder-val font-mono">Rp {{ Number(analysis.support1).toLocaleString('id-ID') }}</b>
        </div>
        <div class="ladder-box s2">
          <span class="ladder-lbl">S2 (Batas Stop Loss)</span>
          <b class="ladder-val font-mono">Rp {{ Number(analysis.support2).toLocaleString('id-ID') }}</b>
        </div>
      </div>
    </div>

    <!-- Interactive Money Management Calculator -->
    <div class="lot-sizing-box">
      <div class="lot-head">
        <span style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: #F8FAFC;">
          <HugeiconsIcon :icon="Calculator01Icon" :size="16" />
          Kalkulator Ukuran Lot & Manajemen Modal
        </span>
        <span style="font-size: 11.5px; color: #94A3B8;">Hitung otomatis alokasi beli berdasarkan toleransi risiko portofolio</span>
      </div>

      <div class="lot-inputs-row">
        <div class="lot-input-group">
          <label>Total Modal Portofolio (Rp)</label>
          <input v-model.number="capital" type="number" step="1000000" min="1000000" class="lot-input font-mono" />
        </div>

        <div class="lot-input-group">
          <label>Maksimal Risiko per Trade (%)</label>
          <select v-model.number="riskTolerancePct" class="lot-input font-mono">
            <option :value="1">1% (Konservatif)</option>
            <option :value="2">2% (Standar Disiplin)</option>
            <option :value="3">3% (Moderat)</option>
            <option :value="5">5% (Agresif)</option>
          </select>
        </div>

        <div class="lot-result-group">
          <span class="res-lbl">Rekomendasi Beli</span>
          <b class="res-val font-mono" style="color: #38BDF8;">{{ recommendedLots }} Lot</b>
          <small class="res-sub">({{ (recommendedLots * 100).toLocaleString('id-ID') }} lembar)</small>
        </div>

        <div class="lot-result-group">
          <span class="res-lbl">Modal Terpakai</span>
          <b class="res-val font-mono">Rp {{ totalInvested.toLocaleString('id-ID') }}</b>
          <small class="res-sub">{{ ((totalInvested / capital) * 100).toFixed(1) }}% dari portofolio</small>
        </div>

        <div class="lot-result-group">
          <span class="res-lbl">Risiko Terburuk (SL)</span>
          <b class="res-val font-mono" style="color: #EF4444;">-Rp {{ actualRiskRp.toLocaleString('id-ID') }}</b>
          <small class="res-sub">Max risk: {{ riskTolerancePct }}%</small>
        </div>

        <div class="lot-result-group">
          <span class="res-lbl">Potensi Cuan (TP1)</span>
          <b class="res-val font-mono" style="color: #10B981;">+Rp {{ potentialGainRp.toLocaleString('id-ID') }}</b>
          <small class="res-sub">Reward ratio 1:{{ activeStrategy.rrRatio.split(':')[1] }}</small>
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
  background: rgba(56, 189, 248, 0.12);
  color: #38BDF8;
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

/* Strategy Grid */
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.strategy-card {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
}
.strategy-card.recommended {
  border-color: #38BDF8;
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, #1E293B 100%);
}

.strat-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.strat-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #F8FAFC;
}

.badge-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}
.badge-green { background: rgba(16, 185, 129, 0.18); color: #34D399; }
.badge-amber { background: rgba(245, 158, 11, 0.18); color: #FBBF24; }

.strat-rationale {
  font-size: 12.5px;
  color: #94A3B8;
  line-height: 1.45;
  margin: 0 0 14px;
}

.price-levels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.price-box {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.price-box.entry { border-color: rgba(56, 189, 248, 0.3); }
.price-box.sl { border-color: rgba(239, 68, 68, 0.3); }
.price-box.tp { border-color: rgba(16, 185, 129, 0.3); }

.price-box .lbl {
  font-size: 10.5px;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.price-box .val {
  font-size: 15px;
  color: #F8FAFC;
  margin-top: 2px;
}
.price-box .sub {
  font-size: 11px;
  color: #64748B;
  margin-top: 1px;
}

.strat-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: #CBD5E1;
}

/* Technical Ladder */
.ladder-section {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
}
.ladder-title {
  margin: 0 0 12px;
  font-size: 12px;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}
.ladder-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
.ladder-box {
  background: #1E293B;
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 3px solid #64748B;
  display: flex;
  flex-direction: column;
}
.ladder-box.r2 { border-left-color: #EF4444; }
.ladder-box.r1 { border-left-color: #F59E0B; }
.ladder-box.pivot { border-left-color: #38BDF8; }
.ladder-box.s1 { border-left-color: #10B981; }
.ladder-box.s2 { border-left-color: #059669; }

.ladder-lbl {
  font-size: 10px;
  color: #94A3B8;
  font-weight: 600;
}
.ladder-val {
  font-size: 13.5px;
  color: #F1F5F9;
  margin-top: 2px;
}

/* Lot Sizing Box */
.lot-sizing-box {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px 20px;
}
.lot-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.lot-inputs-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: center;
}
.lot-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lot-input-group label {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
}
.lot-input {
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 12px;
  color: #F8FAFC;
  font-size: 13.5px;
  outline: 0;
}
.lot-input:focus {
  border-color: #38BDF8;
}

.lot-result-group {
  background: #0F172A;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
}
.res-lbl {
  font-size: 10px;
  color: #94A3B8;
  font-weight: 600;
}
.res-val {
  font-size: 14px;
  color: #F8FAFC;
  margin-top: 2px;
}
.res-sub {
  font-size: 10.5px;
  color: #64748B;
}

@media (max-width: 640px) {
  .card-terminal { padding: 16px; }
  .strategy-grid { grid-template-columns: 1fr; }
  .price-levels-grid { grid-template-columns: 1fr; }
}
</style>
