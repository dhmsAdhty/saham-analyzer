<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Coins01Icon, InformationCircleIcon, ArrowUp01Icon,
  ArrowDown01Icon, SparklesIcon, AlertCircleIcon,
} from '@hugeicons/core-free-icons'

const props = defineProps({
  stock: {
    type: Object,
    required: true,
  },
  brokerAction: {
    type: Object,
    required: true,
  },
})

// Format angka ringkas gaya Stockbit (B = Miliar, M = Juta, K = Ribu)
const formatStockbitValue = (val) => {
  const abs = Math.abs(val)
  if (abs >= 1e12) return `${(abs / 1e12).toFixed(1)}T`
  if (abs >= 1e9) return `${(abs / 1e9).toFixed(1)}B` // B = Billion (Miliar)
  if (abs >= 1e6) return `${(abs / 1e6).toFixed(1)}M` // M = Million (Juta)
  if (abs >= 1e3) return `${(abs / 1e3).toFixed(1)}K` // K = Ribu
  return Number(abs).toLocaleString('id-ID')
}

const formatStockbitLot = (lot) => {
  const abs = Math.abs(lot)
  if (abs >= 1e6) return `${(abs / 1e6).toFixed(1)}M`
  if (abs >= 1e3) return `${(abs / 1e3).toFixed(1)}K`
  return Number(abs).toLocaleString('id-ID')
}
</script>

<template>
  <div class="broker-action-container">
    <!-- Header Title -->
    <div class="ba-header">
      <div class="ba-title-wrap">
        <span class="ba-title">Broker Action</span>
        <span class="info-circle" title="Analisis akumulasi vs distribusi seluruh broker">i</span>
      </div>
      <div class="ba-date font-mono">
        {{ new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' }) }}
      </div>
    </div>

    <!-- Spectrum Bar Indicator: Big Dist | Dist | Neutral | Acc | Big Acc -->
    <div class="spectrum-bar-wrap">
      <div class="spectrum-labels">
        <span class="lbl-big-dist">Big Dist</span>
        <span class="lbl-dist">Dist</span>
        <span class="lbl-neutral">Neutral</span>
        <span class="lbl-acc">Acc</span>
        <span class="lbl-big-acc">Big Acc</span>
      </div>

      <div class="spectrum-track">
        <!-- 5 Segments Color -->
        <div class="seg seg-big-dist"></div>
        <div class="seg seg-dist"></div>
        <div class="seg seg-neutral"></div>
        <div class="seg seg-acc"></div>
        <div class="seg seg-big-acc"></div>

        <!-- Vertical Pin Marker (Garis penunjuk ungu seperti di Stockbit) -->
        <div
          class="spectrum-pin"
          :style="{ left: brokerAction.pinPositionPct + '%' }"
        >
          <div class="pin-head"></div>
          <div class="pin-line"></div>
        </div>
      </div>

      <!-- Current Sentiment Badge -->
      <div class="sentiment-summary-row">
        <span>Sentimen Terdeteksi: <b :style="{ color: brokerAction.sentimentColor }">{{ brokerAction.sentimentCategory }}</b></span>
        <span class="font-mono">
          Net Volume: <b :style="{ color: brokerAction.netLot >= 0 ? '#10B981' : '#EF4444' }">{{ brokerAction.netLot >= 0 ? '+' : '' }}{{ formatStockbitLot(brokerAction.netLot) }} Lot</b>
          ({{ brokerAction.netVal >= 0 ? '+' : '' }}{{ formatStockbitValue(brokerAction.netVal) }})
        </span>
      </div>
    </div>

    <!-- Two-Column Orderbook Broker Action Table -->
    <div class="table-split-wrapper">
      <!-- Sisi Kiri: Buyer (BY) -->
      <div class="side-column buyer-side">
        <table class="ba-table">
          <thead>
            <tr>
              <th style="width: 32px; text-align: left;">BY</th>
              <th style="text-align: right;">B.val</th>
              <th style="text-align: right;">B.lot</th>
              <th style="text-align: right;" class="hide-mobile">B.Freq</th>
              <th style="text-align: right;">B.avg</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in brokerAction.buyerBrokers" :key="b.code">
              <td class="code-col font-mono">{{ b.code }}</td>
              <td class="val-col font-mono text-buy">{{ formatStockbitValue(b.val) }}</td>
              <td class="lot-col font-mono text-muted">{{ formatStockbitLot(b.lot) }}</td>
              <td class="freq-col font-mono text-muted hide-mobile">{{ formatStockbitLot(b.freq) }}</td>
              <td class="avg-col font-mono text-light">{{ b.avg }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sisi Kanan: Seller (SL) -->
      <div class="side-column seller-side">
        <table class="ba-table">
          <thead>
            <tr>
              <th style="width: 32px; text-align: left;">SL</th>
              <th style="text-align: right;">S.val</th>
              <th style="text-align: right;">S.lot</th>
              <th style="text-align: right;" class="hide-mobile">S.Freq</th>
              <th style="text-align: right;">S.avg</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in brokerAction.sellerBrokers" :key="s.code">
              <td class="code-col font-mono">{{ s.code }}</td>
              <td class="val-col font-mono text-sell">{{ formatStockbitValue(s.val) }}</td>
              <td class="lot-col font-mono text-muted">{{ formatStockbitLot(s.lot) }}</td>
              <td class="freq-col font-mono text-muted hide-mobile">{{ formatStockbitLot(s.freq) }}</td>
              <td class="avg-col font-mono text-light">{{ s.avg }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.broker-action-container {
  background: #000000;
  border: 1px solid #1E293B;
  border-radius: 14px;
  padding: 16px 18px;
  color: #FFFFFF;
}

.ba-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.ba-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ba-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #F8FAFC;
}
.info-circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #64748B;
  color: #94A3B8;
  font-size: 10px;
  font-weight: 700;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}
.ba-date {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
}

/* Spectrum Bar */
.spectrum-bar-wrap {
  margin-bottom: 16px;
}
.spectrum-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.lbl-big-dist { color: #DC2626; }
.lbl-dist { color: #EF4444; }
.lbl-neutral { color: #64748B; }
.lbl-acc { color: #34D399; }
.lbl-big-acc { color: #10B981; }

.spectrum-track {
  height: 8px;
  border-radius: 4px;
  display: flex;
  position: relative;
  overflow: visible;
  background: #1E293B;
  margin-bottom: 8px;
}
.seg {
  flex: 1;
  height: 100%;
}
.seg-big-dist { background: #991B1B; border-radius: 4px 0 0 4px; }
.seg-dist { background: #DC2626; }
.seg-neutral { background: #475569; }
.seg-acc { background: #059669; }
.seg-big-acc { background: #10B981; border-radius: 0 4px 4px 0; }

/* Pin Marker Ungu */
.spectrum-pin {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 3px;
  background: #A855F7;
  box-shadow: 0 0 8px #A855F7;
  transform: translateX(-50%);
  z-index: 2;
}
.pin-head {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #A855F7;
  position: absolute;
  top: -3px;
  left: -3px;
  border: 1.5px solid #FFFFFF;
}

.sentiment-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #94A3B8;
  margin-top: 4px;
}

/* Two Column Table Split */
.table-split-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  border-top: 1px solid #1E293B;
  padding-top: 10px;
}

.side-column {
  overflow-x: auto;
}

.buyer-side {
  border-right: 1px solid #1E293B;
  padding-right: 8px;
}

.ba-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11.5px;
}
.ba-table th {
  color: #64748B;
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 6px;
  border-bottom: 1px solid #1E293B;
}
.ba-table td {
  padding: 4px 6px;
  vertical-align: middle;
}
.ba-table tr:hover {
  background: rgba(255, 255, 255, 0.04);
}

.code-col {
  color: #F8FAFC;
  font-weight: 700;
}
.text-buy {
  color: #10B981;
  font-weight: 600;
}
.text-sell {
  color: #EF4444;
  font-weight: 600;
}
.text-muted {
  color: #94A3B8;
}
.text-light {
  color: #F1F5F9;
}

@media (max-width: 640px) {
  .hide-mobile { display: none; }
  .table-split-wrapper { gap: 6px; }
  .buyer-side { padding-right: 4px; }
  .ba-table td, .ba-table th { padding: 3px 4px; font-size: 10.5px; }
}
</style>
