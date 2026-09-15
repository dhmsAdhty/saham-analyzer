<script setup>
import { ref, computed, onMounted } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Search01Icon, Chart01Icon, Target01Icon,
  Analytics01Icon, News01Icon, ArrowUp01Icon,
  ArrowDown01Icon, RefreshIcon, CheckmarkCircle01Icon,
  AlertCircleIcon, Coins01Icon, SparklesIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

import IhsgBanner from './components/IhsgBanner.vue'
import StockChart from './components/StockChart.vue'
import EntryCalculator from './components/EntryCalculator.vue'
import BandarmologyView from './components/BandarmologyView.vue'
import BrokerActionStockbit from './components/BrokerActionStockbit.vue'
import TechnicalSignals from './components/TechnicalSignals.vue'
import ValuationMatrix from './components/ValuationMatrix.vue'
import NewsSentiment from './components/NewsSentiment.vue'
import TradeDecisionCard from './components/TradeDecisionCard.vue'
import ScreenerView from './components/ScreenerView.vue'
import GoApiModal from './components/GoApiModal.vue'

import { fetchStockData, fetchIhsgData } from './services/marketApi.js'
import { getGoApiKey } from './services/goapiService.js'
import { IDX_STOCKS, IHSG_DATA } from './data/stocks.js'

// State
const searchQuery = ref('BBCA')
const currentStock = ref(null)
const ihsgData = ref(IHSG_DATA)
const isLoading = ref(false)
const activeTab = ref('bandarmology') // bandarmology | indicators | entry | valuation | news
const mainView = ref('screener') // 'screener' (default diatas sendiri) | 'analysis'
const showGoApiModal = ref(false)
const hasGoApiKey = ref(false)

// Ticker popouler untuk quick access
const quickTickers = ['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII', 'GOTO', 'AMMN', 'BREN', 'ADRO', 'ICBP']

async function loadStock(ticker, changeView = false) {
  if (!ticker) return
  isLoading.value = true
  try {
    const data = await fetchStockData(ticker)
    if (data) {
      currentStock.value = data
      searchQuery.value = data.ticker
      if (changeView) {
        mainView.value = 'analysis' // Hanya pindah view jika dipicu user klik
      }
    }
  } catch (err) {
    console.error('Failed to load stock', err)
  } finally {
    isLoading.value = false
  }
}

async function loadIhsg() {
  try {
    const live = await fetchIhsgData()
    if (live) ihsgData.value = live
  } catch (e) {
    console.warn('IHSG refresh failed', e)
  }
}

function handleSearchSubmit() {
  if (searchQuery.value.trim()) {
    loadStock(searchQuery.value.trim().toUpperCase(), true)
  }
}

onMounted(() => {
  hasGoApiKey.value = Boolean(getGoApiKey())
  loadStock('BBCA', false) // Inisialisasi data background tanpa mengubah view
  loadIhsg()
  mainView.value = 'screener' // Tetapkan screener di paling atas sebagai highlight utama
})

function onGoApiSaved(key) {
  hasGoApiKey.value = Boolean(key)
  showGoApiModal.value = false
  loadStock(searchQuery.value)
}
</script>

<template>
  <div class="app-terminal">
    <!-- Top IHSG Live Banner -->
    <IhsgBanner v-if="ihsgData" :ihsg="ihsgData" />

    <!-- Main Container -->
    <div class="terminal-body">
      <!-- Top Navigation Tabs (Mode Screening Paling Atas vs Detail Saham) -->
      <div class="top-nav-switcher">
        <button
          type="button"
          class="nav-tab-hero"
          :class="{ active: mainView === 'screener' }"
          @click="mainView = 'screener'"
        >
          <div class="hero-tab-content">
            <span class="pulse-fire">🔥</span>
            <div>
              <div class="tab-main-title">RADAR SCREENING SAHAM POTENSI TERBANG</div>
              <small class="tab-sub-title">Pak Prajogo, Pak Hapsoro, Bakrie, Salim, Big Acc &amp; Breakout</small>
            </div>
          </div>
          <span class="hot-badge font-mono">HOT RADAR</span>
        </button>

        <button
          type="button"
          class="nav-tab-hero"
          :class="{ active: mainView === 'analysis' }"
          @click="mainView = 'analysis'"
        >
          <div class="hero-tab-content">
            <HugeiconsIcon :icon="Chart01Icon" :size="20" style="color: #38BDF8;" />
            <div>
              <div class="tab-main-title">DETAIL ANALISIS &amp; ORDERBOOK ({{ currentStock?.ticker || 'BBCA' }})</div>
              <small class="tab-sub-title">TradingView Candlestick, Broker Action, Entry/TP/SL</small>
            </div>
          </div>
          <span v-if="currentStock?.isLive" class="live-badge font-mono">LIVE IDX</span>
        </button>
      </div>

      <!-- VIEW 1: SCREENING SAHAM DI PALING ATAS (HIGHLIGHT UTAMA) -->
      <div v-if="mainView === 'screener'" class="screener-top-container">
        <ScreenerView
          @select-stock="(t) => { loadStock(t); mainView = 'analysis' }"
        />
      </div>

      <!-- VIEW 2: DETAIL SAHAM & SEARCH TOOLBAR -->
      <div v-show="mainView === 'analysis'" class="analysis-view-container">
        <!-- Search & Quick Navigation Bar -->
        <div class="search-toolbar">
          <form @submit.prevent="handleSearchSubmit" class="search-form">
            <HugeiconsIcon :icon="Search01Icon" :size="18" style="color: #94A3B8; flex: none;" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ketik kode saham BEI (cth: BBCA, BBRI, TLKM, GOTO, ASII, AMMN, BREN)..."
              class="search-input font-mono"
            />
            <button type="submit" class="search-submit-btn">
              Analisis Saham
            </button>
            <!-- Tombol Integrasi GoAPI -->
            <button
              type="button"
              class="goapi-toggle-btn"
              :class="{ connected: hasGoApiKey }"
              @click="showGoApiModal = true"
              title="Pengaturan GoAPI.io"
            >
              <span class="goapi-dot"></span>
              <span>GoAPI: {{ hasGoApiKey ? 'Aktif' : 'Setup' }}</span>
            </button>
          </form>

          <!-- Quick Ticker Chips -->
          <div class="quick-chips">
            <span class="chips-label">Saham Populer:</span>
            <button
              v-for="t in quickTickers"
              :key="t"
              type="button"
              class="ticker-chip font-mono"
              :class="{ active: currentStock?.ticker === t }"
              @click="loadStock(t)"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data pasar, bandarmologi, laporan keuangan &amp; analisis teknikal...</p>
        </div>

        <!-- Stock View Container -->
        <div v-else-if="currentStock" class="stock-dashboard">
        <!-- Hero Header: Ticker, Price & Badges -->
        <div class="stock-hero-card">
          <div class="hero-left">
            <div class="ticker-badge-row">
              <h1 class="ticker-name font-mono">{{ currentStock.ticker }}</h1>
              <span class="company-fullname">{{ currentStock.name }}</span>
              <span class="sector-tag">{{ currentStock.sector }}</span>
              <span v-if="currentStock.isLive" class="live-pill">LIVE IDX</span>
            </div>

            <!-- Price & Gain -->
            <div class="price-action-row">
              <span class="hero-price font-mono">
                Rp {{ Number(currentStock.price).toLocaleString('id-ID') }}
              </span>
              <span :class="['change-tag', currentStock.change >= 0 ? 'up' : 'down']">
                <HugeiconsIcon :icon="currentStock.change >= 0 ? ArrowUp01Icon : ArrowDown01Icon" :size="16" />
                <span>{{ currentStock.change >= 0 ? '+' : '' }}{{ currentStock.change }} ({{ currentStock.change >= 0 ? '+' : '' }}{{ currentStock.changePct }}%)</span>
              </span>
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="hero-right">
            <!-- Bandar Action Metric -->
            <div class="metric-block" :style="{ borderColor: currentStock.bandar.netVolumeLots >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)' }">
              <span class="lbl">Smart Money</span>
              <b class="val font-mono" :style="{ color: currentStock.bandar.netVolumeLots >= 0 ? '#10B981' : '#EF4444' }">
                {{ currentStock.bandar.bandarAction }}
              </b>
              <small class="sub">Score: {{ currentStock.bandar.smartMoneyScore }}/100</small>
            </div>

            <!-- Bandar VWAP Modal -->
            <div class="metric-block">
              <span class="lbl">Modal Bandar (VWAP)</span>
              <b class="val font-mono" style="color: #38BDF8;">
                Rp {{ Number(currentStock.bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}
              </b>
              <small class="sub">Rata-rata Akumulasi</small>
            </div>

            <div class="metric-block">
              <span class="lbl">Valuasi PBV</span>
              <b class="val font-mono" :style="{ color: currentStock.analysis.pbvColor }">
                {{ currentStock.pbv }}x
              </b>
              <small class="sub">{{ currentStock.analysis.pbvStatus.split('/')[0] }}</small>
            </div>

            <div class="metric-block">
              <span class="lbl">Free Float</span>
              <b class="val font-mono" :style="{ color: currentStock.analysis.ffColor }">
                {{ currentStock.freeFloatPct }}%
              </b>
              <small class="sub">{{ currentStock.freeFloatCategory }}</small>
            </div>
          </div>
        </div>

        <!-- Interactive Stock Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Grafik Pergerakan Saham {{ currentStock.ticker }} (30 Hari)</h3>
              <p class="chart-sub">Pergerakan harga penutupan harian dan tren teknikal</p>
            </div>
            <div class="chart-indicators font-mono">
              <span style="color: #38BDF8;">Modal Bandar: Rp {{ Number(currentStock.bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}</span>
              <span style="color: #10B981;">Support 1: Rp {{ Number(currentStock.analysis.support1).toLocaleString('id-ID') }}</span>
              <span style="color: #EF4444;">Resistance 1: Rp {{ Number(currentStock.analysis.resistance1).toLocaleString('id-ID') }}</span>
            </div>
          </div>

          <StockChart
            :history="currentStock.history"
            :ticker="currentStock.ticker"
            :current-price="currentStock.price"
            :analysis="currentStock.analysis"
            :bandar="currentStock.bandar"
            :is-positive="currentStock.changePct >= 0"
          />
        </div>

        <!-- Dedicated Tactical Decision Card (Kesimpulan Eksekutif Entry, SL & TP) -->
        <TradeDecisionCard
          :stock="currentStock"
          :analysis="currentStock.analysis"
          :bandar="currentStock.bandar"
        />

        <!-- Navigation Tabs for Analysis Modules -->
        <div class="tabs-nav">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'bandarmology' }"
            @click="activeTab = 'bandarmology'"
          >
            <HugeiconsIcon :icon="Coins01Icon" :size="16" />
            <span>Bandarmologi &amp; Smart Money</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'indicators' }"
            @click="activeTab = 'indicators'"
          >
            <HugeiconsIcon :icon="SparklesIcon" :size="16" />
            <span>Indikator Sinyal Entry</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'entry' }"
            @click="activeTab = 'entry'"
          >
            <HugeiconsIcon :icon="Target01Icon" :size="16" />
            <span>Kalkulator Entry &amp; Lot Sizing</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'valuation' }"
            @click="activeTab = 'valuation'"
          >
            <HugeiconsIcon :icon="Analytics01Icon" :size="16" />
            <span>Valuasi PBV &amp; Free Float</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'news' }"
            @click="activeTab = 'news'"
          >
            <HugeiconsIcon :icon="News01Icon" :size="16" />
            <span>Isu Berita &amp; Sentimen AI</span>
          </button>
        </div>

        <!-- Tab Modules Content -->
        <div class="tab-content-area">
          <!-- Tab 1: Bandarmologi & Smart Money Flow (with Real Broker Action Table) -->
          <div v-if="activeTab === 'bandarmology'" style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Broker Action Orderbook Table (Style Stockbit) -->
            <BrokerActionStockbit
              :stock="currentStock"
              :broker-action="currentStock.brokerAction"
            />

            <!-- Bandarmology Flow & Smart Money Intelligence -->
            <BandarmologyView
              :stock="currentStock"
              :bandar="currentStock.bandar"
            />
          </div>

          <!-- Tab 2: Multi-Indicator Confluence -->
          <TechnicalSignals
            v-else-if="activeTab === 'indicators'"
            :stock="currentStock"
            :analysis="currentStock.analysis"
            :bandar="currentStock.bandar"
          />

          <!-- Tab 3: Entry & Lot Sizing Calculator -->
          <EntryCalculator
            v-else-if="activeTab === 'entry'"
            :stock="currentStock"
            :analysis="currentStock.analysis"
          />

          <!-- Tab 4: PBV Valuation Matrix & Free Float -->
          <ValuationMatrix
            v-else-if="activeTab === 'valuation'"
            :stock="currentStock"
            :analysis="currentStock.analysis"
          />

          <!-- Tab 5: News & Catalysts -->
          <NewsSentiment
            v-else-if="activeTab === 'news'"
            :stock="currentStock"
          />
        </div>
      </div>
      </div> <!-- analysis-view-container closing -->
    </div> <!-- terminal-body closing -->

    <!-- GoAPI.io Configuration Modal -->
    <GoApiModal
      v-if="showGoApiModal"
      @close="showGoApiModal = false"
      @saved="onGoApiSaved"
    />
  </div>
</template>

<style>
/* Global Dark Financial Theme */
:root {
  --bg-main: #0B0F19;
  --bg-card: #111827;
  --bg-panel: #1E293B;
  --border-color: #1F2937;
  --text-white: #F9FAFB;
  --text-muted: #94A3B8;
  --accent-blue: #38BDF8;
  --accent-green: #10B981;
  --accent-red: #EF4444;
  --accent-amber: #F59E0B;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg-main);
  color: #F3F4F6;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

.app-terminal {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.terminal-body {
  max-width: 1140px; /* Lebar PC dibatasi rapi dan terpusat */
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

/* Top Navigation Switcher (Screening Highlight Paling Atas vs Detail) */
.top-nav-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.nav-tab-hero {
  border: 1px solid #1F2937;
  background: #111827;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.nav-tab-hero:hover {
  border-color: #38BDF8;
  transform: translateY(-2px);
}
.nav-tab-hero.active {
  background: #131E33;
  border-color: #38BDF8;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
}

.hero-tab-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pulse-fire {
  font-size: 24px;
}

.tab-main-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #F8FAFC;
  letter-spacing: 0.02em;
}

.tab-sub-title {
  font-size: 11px;
  color: #94A3B8;
  display: block;
  margin-top: 2px;
}

.hot-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.4);
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

.live-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.4);
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
}

.screener-top-container {
  margin-bottom: 30px;
}

/* Search Toolbar */
.search-toolbar {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.search-form {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 10px 14px;
  transition: border-color 0.15s ease;
}
.search-form:focus-within {
  border-color: #38BDF8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
}

.search-input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #F8FAFC;
  font-size: 14px;
}
.search-input::placeholder {
  color: #64748B;
}

.search-submit-btn {
  border: 0;
  border-radius: 8px;
  padding: 8px 18px;
  background: #38BDF8;
  color: #0F172A;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;
}
.search-submit-btn:hover {
  background: #7DD3FC;
}

.goapi-toggle-btn {
  border: 1px solid #334155;
  background: #1E293B;
  color: #94A3B8;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: 0.15s;
  white-space: nowrap;
}
.goapi-toggle-btn:hover {
  border-color: #475569;
  color: #F8FAFC;
}
.goapi-toggle-btn.connected {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.1);
  color: #34D399;
}
.goapi-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #64748B;
}
.goapi-toggle-btn.connected .goapi-dot {
  background: #10B981;
  box-shadow: 0 0 6px #10B981;
}

.quick-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.chips-label {
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
}

.ticker-chip {
  border: 1px solid #334155;
  background: #1E293B;
  color: #CBD5E1;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.15s;
}
.ticker-chip:hover {
  border-color: #38BDF8;
  color: #F8FAFC;
}
.ticker-chip.active {
  background: #38BDF8;
  border-color: #38BDF8;
  color: #0F172A;
  font-weight: 700;
}

/* Stock Hero Card */
.stock-hero-card {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ticker-badge-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.ticker-name {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: #F8FAFC;
  letter-spacing: -0.02em;
}

.company-fullname {
  font-size: 16px;
  font-weight: 600;
  color: #CBD5E1;
}

.sector-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
  color: #94A3B8;
}

.live-pill {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  background: rgba(16, 185, 129, 0.2);
  color: #34D399;
  border-radius: 4px;
}

.price-action-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hero-price {
  font-size: 26px;
  font-weight: 800;
  color: #F8FAFC;
}

.change-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}
.change-tag.up { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.change-tag.down { background: rgba(239, 68, 68, 0.15); color: #EF4444; }

.hero-right {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.metric-block {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
}

.metric-block .lbl {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.metric-block .val {
  font-size: 18px;
  color: #F8FAFC;
  margin-top: 4px;
}
.metric-block .sub {
  font-size: 10.5px;
  color: #64748B;
  margin-top: 2px;
}

/* Chart Card */
.chart-card {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #F8FAFC;
}
.chart-sub {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: #94A3B8;
}
.chart-indicators {
  display: flex;
  gap: 16px;
  font-size: 12px;
  font-weight: 600;
  flex-wrap: wrap;
}

/* Tabs Nav */
.tabs-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs-nav::-webkit-scrollbar { display: none; }

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111827;
  border: 1px solid #1F2937;
  color: #94A3B8;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.tab-btn:hover {
  border-color: #334155;
  color: #F8FAFC;
}
.tab-btn.active {
  background: #1E293B;
  border-color: #38BDF8;
  color: #F8FAFC;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.12);
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #94A3B8;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(56, 189, 248, 0.2);
  border-top-color: #38BDF8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .top-nav-switcher { grid-template-columns: 1fr; gap: 10px; margin-bottom: 16px; }
  .nav-tab-hero { padding: 12px 14px; }
  .tab-main-title { font-size: 12px; }
  .terminal-body { padding: 14px 12px 60px; width: 100%; max-width: 100vw; box-sizing: border-box; }
  .search-toolbar { padding: 12px; }
  .search-form { flex-wrap: wrap; gap: 8px; padding: 8px 10px; }
  .search-input { width: 100%; min-width: 180px; }
  .search-submit-btn { flex: 1; }
  .goapi-toggle-btn { flex: 1; justify-content: center; }
  .stock-hero-card { padding: 14px; gap: 14px; }
  .ticker-name { font-size: 22px; }
  .hero-price { font-size: 20px; }
  .hero-right { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .metric-block { min-width: 0; padding: 10px 12px; }
  .metric-block .val { font-size: 15px; }
  .chart-card { padding: 14px; }
  .chart-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .chart-indicators { flex-direction: column; gap: 4px; }
  .tabs-nav { width: 100%; overflow-x: auto; padding-bottom: 6px; }
  .tab-btn { padding: 10px 14px; font-size: 12px; }
}

html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
</style>
