<script setup>
import { ref, onMounted } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  SparklesIcon, ArrowUp01Icon, ArrowDown01Icon,
  Coins01Icon, Target01Icon, FilterIcon,
  CheckmarkCircle01Icon, AlertCircleIcon, Search01Icon
} from '@hugeicons/core-free-icons'
import { runStockScreener } from '../data/screenerEngine.js'

const emit = defineEmits(['selectStock'])

const activeFilter = ref('all') // all | ready_to_fly | silent_acc | big_caps
const screenerList = ref([])
const searchQuery = ref('')
const isLoading = ref(false)

async function loadScreener() {
  isLoading.value = true
  try {
    screenerList.value = await runStockScreener(activeFilter.value)
  } finally {
    isLoading.value = false
  }
}

function setFilter(filter) {
  activeFilter.value = filter
  loadScreener()
}

function onCardClick(ticker) {
  emit('selectStock', ticker)
}

onMounted(() => {
  loadScreener()
})
</script>

<template>
  <div class="screener-view">
    <!-- Header Screener Banner -->
    <div class="screener-hero-banner">
      <div class="hero-left-content">
        <div class="screener-badge">
          <HugeiconsIcon :icon="SparklesIcon" :size="16" style="color: #F59E0B;" />
          <span>RADAR SMART MONEY &amp; POTENSI TERBANG</span>
        </div>
        <h2 class="screener-title">Screening Saham Berpotensi Terbang (High Probability)</h2>
        <p class="screener-desc">
          Memindai seluruh saham di bursa berdasarkan <b>Akumulasi Bandar Masif</b>, <b>Sentimen Berita Positif</b>, dan <b>Harga Pasar yang Masih Dekat dengan Modal Bandar (VWAP)</b>.
        </p>
      </div>

      <!-- Quick Filter Pills -->
      <div class="screener-filter-bar">
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          Semua Hasil (Top Rank)
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'ready_to_fly' }"
          @click="setFilter('ready_to_fly')"
        >
          🚀 Siap Terbang (Big Acc)
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'prajogo' }"
          @click="setFilter('prajogo')"
        >
          🔥 Grup Pak Prajogo (PP)
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'hapsoro' }"
          @click="setFilter('hapsoro')"
        >
          ⚡ Grup Pak Hapsoro
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'bakrie_salim' }"
          @click="setFilter('bakrie_salim')"
        >
          💎 Bakrie &amp; Salim Group
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'silent_acc' }"
          @click="setFilter('silent_acc')"
        >
          🤫 Akumulasi Senyap
        </button>
        <button
          class="filter-pill"
          :class="{ active: activeFilter === 'big_caps' }"
          @click="setFilter('big_caps')"
        >
          🏛️ Big Banks &amp; Bluechips
        </button>
      </div>
    </div>

    <!-- Screener Cards Grid -->
    <div class="screener-cards-grid">
      <div
        v-for="item in screenerList"
        :key="item.ticker"
        class="screener-card"
        :class="{ 'is-top': item.isTopPick }"
        @click="onCardClick(item.ticker)"
      >
        <!-- Card Top: Ticker, Price & Fly Score -->
        <div class="card-head">
          <div class="ticker-box">
            <div class="code-row">
              <span class="ticker-code font-mono">{{ item.ticker }}</span>
              <span v-if="item.isTopPick" class="top-tag">TOP PICK 🚀</span>
              <span v-if="item.group && item.group !== 'Umum'" class="group-tag">{{ item.group }}</span>
            </div>
            <span class="company-name">{{ item.name }}</span>
          </div>

          <!-- Skor Potensi Terbang Meter -->
          <div class="fly-score-gauge">
            <span class="gauge-lbl">SKOR TERBANG</span>
            <b class="gauge-val font-mono" :style="{ color: item.flyScore >= 75 ? '#10B981' : item.flyScore >= 60 ? '#38BDF8' : '#F59E0B' }">
              {{ item.flyScore }}<small>/100</small>
            </b>
          </div>
        </div>

        <!-- Harga & Perubahan -->
        <div class="card-price-row">
          <span class="cur-price font-mono">Rp {{ Number(item.price).toLocaleString('id-ID') }}</span>
          <span :class="['change-pill', item.changePct >= 0 ? 'up' : 'down']">
            {{ item.changePct >= 0 ? '+' : '' }}{{ item.changePct }}%
          </span>
          <span class="sector-sub">{{ item.sector }}</span>
        </div>

        <!-- Smart Money Status & Modal Bandar Bar -->
        <div class="bandar-status-strip">
          <div class="status-col">
            <span class="k">Aksi Smart Money:</span>
            <b class="v font-mono" :style="{ color: item.bandarScore >= 15 ? '#10B981' : item.bandarScore <= -15 ? '#EF4444' : '#94A3B8' }">
              {{ item.bandarStatus }}
            </b>
          </div>
          <div class="status-col text-right">
            <span class="k">Modal Bandar (VWAP):</span>
            <b class="v font-mono" style="color: #38BDF8;">Rp {{ Number(item.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}</b>
          </div>
        </div>

        <!-- Rekomendasi Titik Eksekusi Cepat (Entry, TP, SL) -->
        <div class="trade-plan-preview">
          <div class="plan-col">
            <span class="p-lbl">Area Entry:</span>
            <b class="p-val font-mono" style="color: #F59E0B;">Rp {{ item.entryLow }}–{{ item.entryHigh }}</b>
          </div>
          <div class="plan-col">
            <span class="p-lbl">Target TP1:</span>
            <b class="p-val font-mono" style="color: #10B981;">Rp {{ item.tp1 }}</b>
          </div>
          <div class="plan-col">
            <span class="p-lbl">Cut Loss (SL):</span>
            <b class="p-val font-mono" style="color: #EF4444;">Rp {{ item.sl }}</b>
          </div>
        </div>

        <!-- Katalis Isu / Berita Utama -->
        <div class="card-catalyst-box">
          <div class="cat-label">
            <HugeiconsIcon :icon="SparklesIcon" :size="13" style="color: #F59E0B;" />
            <span>Katalis &amp; Isu Utama:</span>
          </div>
          <p class="cat-text">{{ item.keyCatalyst }}</p>
        </div>

        <!-- Tombol Buka Analisis Lengkap -->
        <div class="card-action-bar">
          <span>Klik untuk buka chart &amp; orderbook lengkap</span>
          <span class="arrow-symbol">&rarr;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screener-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.screener-hero-banner {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.screener-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.12);
  color: #F59E0B;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.screener-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #F8FAFC;
  letter-spacing: -0.01em;
}

.screener-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: #94A3B8;
  line-height: 1.5;
  max-width: 780px;
}
.screener-desc b {
  color: #E2E8F0;
}

.screener-filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-top: 1px solid #1E293B;
  padding-top: 14px;
}

.filter-pill {
  border: 1px solid #334155;
  background: #1E293B;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.15s;
}
.filter-pill:hover {
  border-color: #475569;
  color: #F8FAFC;
}
.filter-pill.active {
  background: #38BDF8;
  border-color: #38BDF8;
  color: #0F172A;
}

/* Cards Grid */
.screener-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.screener-card {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.screener-card:hover {
  transform: translateY(-3px);
  border-color: #38BDF8;
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.15);
}

.screener-card.is-top {
  border-color: rgba(16, 185, 129, 0.4);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ticker-code {
  font-size: 22px;
  font-weight: 800;
  color: #F8FAFC;
}

.top-tag {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.group-tag {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.company-name {
  font-size: 12px;
  color: #94A3B8;
  display: block;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.fly-score-gauge {
  text-align: right;
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 8px;
  padding: 4px 8px;
}
.gauge-lbl {
  font-size: 9px;
  font-weight: 800;
  color: #64748B;
  display: block;
}
.gauge-val {
  font-size: 16px;
  font-weight: 800;
}
.gauge-val small {
  font-size: 10px;
  color: #64748B;
}

.card-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.cur-price {
  font-size: 18px;
  font-weight: 800;
  color: #F8FAFC;
}
.change-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.change-pill.up { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.change-pill.down { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
.sector-sub {
  font-size: 11px;
  color: #64748B;
  margin-left: auto;
}

/* Status Strip */
.bandar-status-strip {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}
.status-col {
  display: flex;
  flex-direction: column;
}
.status-col .k { color: #64748B; font-size: 10px; text-transform: uppercase; }
.status-col .v { font-size: 11.5px; }

/* Plan Preview */
.trade-plan-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 8px;
  padding: 8px;
  text-align: center;
}
.plan-col .p-lbl { font-size: 9.5px; color: #94A3B8; display: block; }
.plan-col .p-val { font-size: 11.5px; }

/* Catalyst */
.card-catalyst-box {
  background: #0F172A;
  border-radius: 8px;
  padding: 8px 10px;
  border-left: 3px solid #F59E0B;
}
.cat-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: #CBD5E1;
  margin-bottom: 2px;
}
.cat-text {
  margin: 0;
  font-size: 11px;
  color: #94A3B8;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
  color: #38BDF8;
  font-weight: 600;
  border-top: 1px solid #1E293B;
  padding-top: 10px;
}
.arrow-symbol {
  font-size: 14px;
  transition: transform 0.15s;
}
.screener-card:hover .arrow-symbol {
  transform: translateX(4px);
}
</style>
