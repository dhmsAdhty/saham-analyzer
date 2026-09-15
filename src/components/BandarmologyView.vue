<script setup>
import { computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Coins01Icon, Chart01Icon, ArrowUp01Icon, ArrowDown01Icon,
  CheckmarkCircle01Icon, AlertCircleIcon, Target01Icon,
  SparklesIcon, UserGroupIcon, Analytics01Icon,
} from '@hugeicons/core-free-icons'

const props = defineProps({
  stock: {
    type: Object,
    required: true,
  },
  bandar: {
    type: Object,
    required: true,
  },
})

// Helper format Rupiah Miliar/Triliun
const formatBillion = (val) => {
  const abs = Math.abs(val)
  const sign = val < 0 ? '-' : '+'
  if (abs >= 1e12) return `${sign}Rp ${(abs / 1e12).toFixed(2)} Triliun`
  if (abs >= 1e9) return `${sign}Rp ${(abs / 1e9).toFixed(1)} Miliar`
  return `${sign}Rp ${Math.round(abs).toLocaleString('id-ID')}`
}
</script>

<template>
  <div class="card-terminal">
    <!-- Header Section -->
    <div class="card-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="icon-wrap-brand" style="background: rgba(168, 85, 247, 0.15); color: #C084FC;">
          <HugeiconsIcon :icon="Coins01Icon" :size="20" />
        </div>
        <div>
          <h3 class="card-title">Bandarmologi & Smart Money Flow Intelligence</h3>
          <p class="card-sub">Lacak volume transaksi akumulasi/distribusi bandar, broker summary, dan harga rata-rata modal smart money</p>
        </div>
      </div>
      <span class="badge-status font-mono" :style="{ borderColor: bandar.netVolumeLots >= 0 ? '#10B981' : '#EF4444', color: bandar.netVolumeLots >= 0 ? '#34D399' : '#F87171' }">
        STATUS: {{ bandar.bandarStatus.toUpperCase() }}
      </span>
    </div>

    <!-- Main Signal Banner: Sinyal Entry Berdasarkan Modal Bandar -->
    <div class="signal-box" :style="{ borderColor: bandar.entrySignalColor }">
      <div class="signal-left">
        <div class="signal-badge" :style="{ background: bandar.entrySignalColor + '25', color: bandar.entrySignalColor }">
          <HugeiconsIcon :icon="bandar.netVolumeLots >= 0 ? SparklesIcon : AlertCircleIcon" :size="16" />
          <span>{{ bandar.entrySignal }}</span>
        </div>
        <p class="signal-desc">{{ bandar.entrySignalDesc }}</p>
      </div>

      <!-- Comparison Price vs Bandar Average -->
      <div class="signal-metrics">
        <div class="metric-pill">
          <span class="m-lbl">Harga Saham Sekarang</span>
          <b class="m-val font-mono">Rp {{ Number(stock.price).toLocaleString('id-ID') }}</b>
        </div>
        <div class="metric-pill highlight">
          <span class="m-lbl">Modal Rata-rata Bandar (VWAP)</span>
          <b class="m-val font-mono" style="color: #38BDF8;">Rp {{ Number(bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}</b>
        </div>
      </div>
    </div>

    <!-- 4 KPI Cards: Bandar Flow -->
    <div class="kpi-bandar-grid">
      <!-- 1. Smart Money Score -->
      <div class="kpi-bandar-card">
        <span class="k-lbl">Smart Money Flow Score</span>
        <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 4px;">
          <b class="k-val font-mono" :style="{ color: bandar.smartMoneyScore >= 60 ? '#10B981' : '#EF4444' }">
            {{ bandar.smartMoneyScore }}<small style="font-size: 14px;">/100</small>
          </b>
          <span class="k-tag" :class="bandar.smartMoneyScore >= 60 ? 'tag-green' : 'tag-red'">
            {{ bandar.smartMoneyScore >= 60 ? 'Bullish Flow' : 'Bearish Flow' }}
          </span>
        </div>
        <div class="bar-meter">
          <div class="bar-fill" :style="{ width: bandar.smartMoneyScore + '%', background: bandar.smartMoneyScore >= 60 ? '#10B981' : '#EF4444' }"></div>
        </div>
        <span class="k-sub">Fase: <b>{{ bandar.smartMoneyPhase }}</b></span>
      </div>

      <!-- 2. Net Bandar Volume (Lot) -->
      <div class="kpi-bandar-card">
        <span class="k-lbl">Net Volume Bandar (Top 5)</span>
        <div style="margin-top: 4px;">
          <b class="k-val font-mono" :style="{ color: bandar.netVolumeLots >= 0 ? '#10B981' : '#EF4444' }">
            {{ bandar.netVolumeLots >= 0 ? '+' : '' }}{{ Number(bandar.netVolumeLots).toLocaleString('id-ID') }}
            <small style="font-size: 13px; font-weight: 500; color: #94A3B8;">Lot</small>
          </b>
        </div>
        <span class="k-sub" style="margin-top: 8px;">
          Buy/Sell Ratio: <b class="font-mono" style="color: #38BDF8;">{{ bandar.bandarVolumeRatio }}x</b>
        </span>
      </div>

      <!-- 3. Net Value (Rupiah) -->
      <div class="kpi-bandar-card">
        <span class="k-lbl">Net Value Transaksi Bandar</span>
        <div style="margin-top: 4px;">
          <b class="k-val font-mono" :style="{ color: bandar.netValueRp >= 0 ? '#10B981' : '#EF4444' }">
            {{ formatBillion(bandar.netValueRp) }}
          </b>
        </div>
        <span class="k-sub" style="margin-top: 8px;">
          Asing Net Flow: <b class="font-mono" :style="{ color: bandar.foreignNetRp >= 0 ? '#10B981' : '#EF4444' }">{{ formatBillion(bandar.foreignNetRp) }}</b>
        </span>
      </div>

      <!-- 4. Retail Sentiment & Activity -->
      <div class="kpi-bandar-card">
        <span class="k-lbl">Perilaku Ritel Domestik</span>
        <div style="margin-top: 4px;">
          <b class="k-val" style="font-size: 15px; color: #F8FAFC;">
            {{ bandar.retailActivity.split('(')[0] }}
          </b>
        </div>
        <span class="k-sub" style="margin-top: 8px; color: #94A3B8;">
          {{ bandar.retailActivity }}
        </span>
      </div>
    </div>

    <!-- Broker Summary Ledger (Top Buyer vs Top Seller) -->
    <div class="broker-summary-section">
      <div class="section-title-row">
        <div>
          <h4 class="broker-sec-title">Broker Summary (Top 5 Akumulasi vs Distribusi)</h4>
          <p class="broker-sec-sub">Rincian sekuritas yang paling banyak memborong dan melepas saham hari ini</p>
        </div>
        <span class="font-mono" style="font-size: 12px; color: #94A3B8;">
          Net Top 5: <b :style="{ color: bandar.netTopLots >= 0 ? '#10B981' : '#EF4444' }">{{ bandar.netTopLots >= 0 ? '+' : '' }}{{ Number(bandar.netTopLots).toLocaleString('id-ID') }} Lot</b>
        </span>
      </div>

      <div class="broker-tables-grid">
        <!-- Kolom Kiri: Top Buyer (Smart Money / Akumulator) -->
        <div class="broker-panel buyer">
          <div class="panel-tag buy">
            <span class="dot-buy"></span>
            <span>TOP 5 BUYERS (AKUMULASI) — TOTAL: {{ Number(bandar.totalTopBuyLots).toLocaleString('id-ID') }} LOT</span>
          </div>

          <table class="broker-table">
            <thead>
              <tr>
                <th style="width: 44px;">KODE</th>
                <th>NAMA SEKURITAS</th>
                <th>TIPE</th>
                <th style="text-align: right;">VOLUME (LOT)</th>
                <th style="text-align: right;">AVG HARGA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in bandar.topBuyerBrokers" :key="b.code">
                <td>
                  <span class="code-badge buy font-mono">{{ b.code }}</span>
                </td>
                <td style="font-weight: 600; color: #F8FAFC; font-size: 12.5px;">{{ b.name }}</td>
                <td>
                  <span class="type-pill" :class="b.type.includes('Asing') ? 'asing' : 'domestik'">{{ b.type }}</span>
                </td>
                <td style="text-align: right; font-weight: 700; color: #10B981; font-variant-numeric: tabular-nums;">
                  {{ Number(b.buyLot).toLocaleString('id-ID') }}
                </td>
                <td style="text-align: right; font-weight: 600; color: #F1F5F9; font-variant-numeric: tabular-nums;">
                  Rp {{ Number(b.avgPrice).toLocaleString('id-ID') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Kolom Kanan: Top Seller (Distributor) -->
        <div class="broker-panel seller">
          <div class="panel-tag sell">
            <span class="dot-sell"></span>
            <span>TOP 5 SELLERS (DISTRIBUSI) — TOTAL: {{ Number(bandar.totalTopSellLots).toLocaleString('id-ID') }} LOT</span>
          </div>

          <table class="broker-table">
            <thead>
              <tr>
                <th style="width: 44px;">KODE</th>
                <th>NAMA SEKURITAS</th>
                <th>TIPE</th>
                <th style="text-align: right;">VOLUME (LOT)</th>
                <th style="text-align: right;">AVG HARGA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in bandar.topSellerBrokers" :key="s.code">
                <td>
                  <span class="code-badge sell font-mono">{{ s.code }}</span>
                </td>
                <td style="font-weight: 600; color: #F8FAFC; font-size: 12.5px;">{{ s.name }}</td>
                <td>
                  <span class="type-pill" :class="s.type.includes('Asing') ? 'asing' : 'domestik'">{{ s.type }}</span>
                </td>
                <td style="text-align: right; font-weight: 700; color: #EF4444; font-variant-numeric: tabular-nums;">
                  {{ Number(s.sellLot).toLocaleString('id-ID') }}
                </td>
                <td style="text-align: right; font-weight: 600; color: #F1F5F9; font-variant-numeric: tabular-nums;">
                  Rp {{ Number(s.avgPrice).toLocaleString('id-ID') }}
                </td>
              </tr>
            </tbody>
          </table>
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

.badge-status {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
}

/* Sinyal Banner */
.signal-box {
  background: #1E293B;
  border: 1.5px solid;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.signal-left {
  flex: 1;
  min-width: 280px;
}

.signal-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.03em;
  margin-bottom: 6px;
}

.signal-desc {
  margin: 0;
  font-size: 13px;
  color: #CBD5E1;
  line-height: 1.45;
}

.signal-metrics {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.metric-pill {
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
}
.metric-pill.highlight {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.06);
}
.m-lbl {
  font-size: 10.5px;
  color: #94A3B8;
  font-weight: 600;
  text-transform: uppercase;
}
.m-val {
  font-size: 15px;
  color: #F8FAFC;
  margin-top: 2px;
}

/* KPI Bandar Grid */
.kpi-bandar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.kpi-bandar-card {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.k-lbl {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.k-val {
  font-size: 20px;
  font-weight: 800;
  color: #F8FAFC;
  letter-spacing: -0.01em;
}
.k-sub {
  font-size: 11.5px;
  color: #94A3B8;
  margin-top: auto;
  padding-top: 6px;
}
.k-sub b {
  color: #F1F5F9;
}

.k-tag {
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}
.tag-green { background: rgba(16, 185, 129, 0.2); color: #34D399; }
.tag-red { background: rgba(239, 68, 68, 0.2); color: #F87171; }

.bar-meter {
  height: 6px;
  border-radius: 999px;
  background: #0F172A;
  margin: 8px 0;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* Broker Summary Section */
.broker-summary-section {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 14px;
  padding: 20px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.broker-sec-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #F8FAFC;
}
.broker-sec-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94A3B8;
}

.broker-tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.broker-panel {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
}

.panel-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.panel-tag.buy { background: rgba(16, 185, 129, 0.15); color: #10B981; border-bottom: 1px solid rgba(16, 185, 129, 0.2); }
.panel-tag.sell { background: rgba(239, 68, 68, 0.15); color: #EF4444; border-bottom: 1px solid rgba(239, 68, 68, 0.2); }

.dot-buy { width: 6px; height: 6px; border-radius: 50%; background: #10B981; }
.dot-sell { width: 6px; height: 6px; border-radius: 50%; background: #EF4444; }

.broker-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}
.broker-table th {
  background: #131E2E;
  color: #94A3B8;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 8px 10px;
  border-bottom: 1px solid #334155;
}
.broker-table td {
  padding: 9px 10px;
  border-bottom: 1px solid #243044;
  vertical-align: middle;
}
.broker-table tr:last-child td {
  border-bottom: 0;
}

.code-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 11px;
}
.code-badge.buy { background: rgba(16, 185, 129, 0.2); color: #34D399; }
.code-badge.sell { background: rgba(239, 68, 68, 0.2); color: #F87171; }

.type-pill {
  font-size: 10.5px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.type-pill.asing { background: rgba(56, 189, 248, 0.15); color: #38BDF8; }
.type-pill.domestik { background: rgba(255, 255, 255, 0.08); color: #94A3B8; }

@media (max-width: 900px) {
  .broker-tables-grid { grid-template-columns: 1fr; }
}
</style>
