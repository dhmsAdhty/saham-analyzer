<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  SparklesIcon, Maximize01Icon, Minimize01Icon,
} from '@hugeicons/core-free-icons'
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts'

const props = defineProps({
  history: {
    type: Array,
    required: true,
  },
  ticker: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
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
  isPositive: {
    type: Boolean,
    default: true,
  },
})

const chartContainer = ref(null)
let chartInstance = null
let candleSeries = null
let vwapLineSeries = null
let ma20Series = null
let ma50Series = null
let volumeSeries = null

const isFullscreen = ref(false)
const activeTimeframe = ref('1D')
const showIndicators = ref({
  ma20: true,
  ma50: true,
  vwap: true,
  volume: true,
  priceLevels: true
})

// Konversi data historis ke format Candlestick Lightweight Charts v5
function formatCandleData(history) {
  if (!history || history.length === 0) return []
  
  const today = new Date()
  const len = history.length
  return history.map((item, idx) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (len - 1 - idx))
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const timeStr = `${y}-${m}-${day}`
    
    const close = item.price
    const prevClose = idx > 0 ? history[idx - 1].price : close
    const open = prevClose
    const high = Math.max(open, close) + Math.round(close * 0.008)
    const low = Math.min(open, close) - Math.round(close * 0.008)

    return {
      time: timeStr,
      open,
      high,
      low,
      close,
      volume: item.volume || 150000
    }
  })
}

function initChart() {
  if (!chartContainer.value) return
  if (chartInstance) {
    chartInstance.remove()
    chartInstance = null
  }

  const height = isFullscreen.value ? 550 : 360

  chartInstance = createChart(chartContainer.value, {
    height,
    layout: {
      background: { color: '#0B0F19' },
      textColor: '#94A3B8',
      fontFamily: 'JetBrains Mono, monospace',
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
    },
    crosshair: {
      mode: 0,
      vertLine: { color: '#38BDF8', width: 1, style: 2 },
      horzLine: { color: '#38BDF8', width: 1, style: 2 },
    },
    rightPriceScale: {
      borderColor: '#1F2937',
      scaleMargins: { top: 0.1, bottom: 0.25 },
    },
    timeScale: {
      borderColor: '#1F2937',
      timeVisible: true,
      secondsVisible: false,
    },
  })

  // 1. Candlestick Series (Lightweight Charts v5 API: addSeries(CandlestickSeries, options))
  candleSeries = chartInstance.addSeries(CandlestickSeries, {
    upColor: '#10B981',
    downColor: '#EF4444',
    borderVisible: false,
    wickUpColor: '#10B981',
    wickDownColor: '#EF4444',
  })

  // 2. Volume Series (HistogramSeries)
  volumeSeries = chartInstance.addSeries(HistogramSeries, {
    color: '#38BDF8',
    priceFormat: { type: 'volume' },
    priceScaleId: '', // Overlay di pane utama
    scaleMargins: { top: 0.8, bottom: 0 },
  })

  // 3. MA20 Line Series
  ma20Series = chartInstance.addSeries(LineSeries, {
    color: '#F59E0B',
    lineWidth: 1.5,
    title: 'MA20',
  })

  // 4. MA50 Line Series
  ma50Series = chartInstance.addSeries(LineSeries, {
    color: '#818CF8',
    lineWidth: 1.5,
    title: 'MA50',
  })

  // 5. Modal Bandar (VWAP) Series
  vwapLineSeries = chartInstance.addSeries(LineSeries, {
    color: '#38BDF8',
    lineWidth: 2,
    lineStyle: 2,
    title: 'Bandar VWAP',
  })

  loadChartData()

  // Garis Horizontal Level Kunci (Price Lines)
  if (showIndicators.value.priceLevels && props.analysis) {
    if (props.analysis.takeProfit1) {
      candleSeries.createPriceLine({
        price: props.analysis.takeProfit1,
        color: '#10B981',
        lineWidth: 1.5,
        lineStyle: 1,
        axisLabelVisible: true,
        title: 'OUT (TP1)',
      })
    }
    if (props.analysis.entryBuyHigh) {
      candleSeries.createPriceLine({
        price: props.analysis.entryBuyHigh,
        color: '#F59E0B',
        lineWidth: 1.5,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'ENTRY IDEAL',
      })
    }
    if (props.analysis.stopLoss) {
      candleSeries.createPriceLine({
        price: props.analysis.stopLoss,
        color: '#EF4444',
        lineWidth: 1.5,
        lineStyle: 1,
        axisLabelVisible: true,
        title: 'OUT (SL)',
      })
    }
  }

  chartInstance.timeScale().fitContent()
}

function loadChartData() {
  const candles = formatCandleData(props.history)
  if (candles.length === 0) return

  candleSeries?.setData(candles)

  // Volume
  if (showIndicators.value.volume) {
    const volData = candles.map(c => ({
      time: c.time,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'
    }))
    volumeSeries?.setData(volData)
  }

  // Hitung MA20 & MA50
  const ma20Data = []
  const ma50Data = []
  const vwapVal = props.bandar.smartMoneyAvgBuyPrice || props.currentPrice
  const vwapData = []

  for (let i = 0; i < candles.length; i++) {
    const t = candles[i].time
    vwapData.push({ time: t, value: vwapVal })

    if (i >= 4) {
      const slice20 = candles.slice(Math.max(0, i - 19), i + 1)
      const avg20 = slice20.reduce((s, c) => s + c.close, 0) / slice20.length
      ma20Data.push({ time: t, value: Math.round(avg20) })
    }
    if (i >= 9) {
      const slice50 = candles.slice(Math.max(0, i - 49), i + 1)
      const avg50 = slice50.reduce((s, c) => s + c.close, 0) / slice50.length
      ma50Data.push({ time: t, value: Math.round(avg50) })
    }
  }

  if (showIndicators.value.ma20) ma20Series?.setData(ma20Data)
  if (showIndicators.value.ma50) ma50Series?.setData(ma50Data)
  if (showIndicators.value.vwap) vwapLineSeries?.setData(vwapData)
}

function setTimeframe(tf) {
  activeTimeframe.value = tf
  initChart()
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  nextTick(() => {
    initChart()
  })
}

function toggleIndicator(key) {
  showIndicators.value[key] = !showIndicators.value[key]
  initChart()
}

onMounted(() => {
  nextTick(() => initChart())
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.remove()
  }
})

function handleResize() {
  if (chartInstance && chartContainer.value) {
    chartInstance.applyOptions({ width: chartContainer.value.clientWidth })
  }
}

watch(
  () => [props.history, props.ticker, props.currentPrice],
  () => {
    nextTick(() => initChart())
  },
  { deep: true }
)
</script>

<template>
  <div :class="['stock-chart-wrapper', { 'is-fullscreen': isFullscreen }]">
    <!-- Chart Top Toolbar -->
    <div class="chart-pro-toolbar">
      <div class="tf-group">
        <span class="toolbar-label">TF:</span>
        <button
          v-for="tf in ['5m', '15m', '1H', '1D', '1W']"
          :key="tf"
          :class="['tf-btn', { active: activeTimeframe === tf }]"
          @click="setTimeframe(tf)"
        >
          {{ tf }}
        </button>
      </div>

      <div class="indicator-toggles">
        <button
          class="ind-chip"
          :class="{ active: showIndicators.vwap }"
          @click="toggleIndicator('vwap')"
        >
          <span class="ind-dot" style="background: #38BDF8;"></span>
          <span>Modal Bandar</span>
        </button>
        <button
          class="ind-chip"
          :class="{ active: showIndicators.ma20 }"
          @click="toggleIndicator('ma20')"
        >
          <span class="ind-dot" style="background: #F59E0B;"></span>
          <span>MA20</span>
        </button>
        <button
          class="ind-chip"
          :class="{ active: showIndicators.ma50 }"
          @click="toggleIndicator('ma50')"
        >
          <span class="ind-dot" style="background: #818CF8;"></span>
          <span>MA50</span>
        </button>
        <button
          class="ind-chip"
          :class="{ active: showIndicators.volume }"
          @click="toggleIndicator('volume')"
        >
          <span>Volume</span>
        </button>
      </div>

      <div class="expand-wrapper">
        <button class="expand-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Kecilkan' : 'Perbesar Layar Penuh'">
          <HugeiconsIcon :icon="isFullscreen ? Minimize01Icon : Maximize01Icon" :size="16" />
          <span>{{ isFullscreen ? 'Tutup Penuh' : 'Perbesar Grafik' }}</span>
        </button>
      </div>
    </div>

    <!-- TradingView Lightweight Canvas Container -->
    <div ref="chartContainer" class="tradingview-container"></div>

    <!-- Interactive Tactical Entry & Exit Guidance Box -->
    <div class="entry-out-strip">
      <div class="level-card entry">
        <div class="lvl-head">
          <span class="lvl-badge">TITIK ENTRY</span>
          <b class="lvl-title">Beli Ideal (BoW)</b>
        </div>
        <div class="lvl-price font-mono">
          Rp {{ Number(analysis.entryBuyLow).toLocaleString('id-ID') }} – {{ Number(analysis.entryBuyHigh).toLocaleString('id-ID') }}
        </div>
        <div class="lvl-desc">
          Diselaraskan Fraksi BEI dekat Modal Bandar (<b>Rp {{ Number(bandar.smartMoneyAvgBuyPrice).toLocaleString('id-ID') }}</b>).
        </div>
      </div>

      <div class="level-card tp">
        <div class="lvl-head">
          <span class="lvl-badge">TITIK OUT (PROFIT)</span>
          <b class="lvl-title">Target Take Profit (TP1 &amp; TP2)</b>
        </div>
        <div class="lvl-price font-mono">
          Rp {{ Number(analysis.takeProfit1).toLocaleString('id-ID') }} / Rp {{ Number(analysis.takeProfit2).toLocaleString('id-ID') }}
        </div>
        <div class="lvl-desc">
          1 tick sebelum Offer Resistance 1 (+{{ (((analysis.takeProfit1 - currentPrice) / currentPrice) * 100).toFixed(1) }}%).
        </div>
      </div>

      <div class="level-card sl">
        <div class="lvl-head">
          <span class="lvl-badge">TITIK OUT (PROTEKSI)</span>
          <b class="lvl-title">Disiplin Stop Loss (SL)</b>
        </div>
        <div class="lvl-price font-mono">
          Rp {{ Number(analysis.stopLoss).toLocaleString('id-ID') }}
        </div>
        <div class="lvl-desc">
          Proteksi di bawah Support Struktural &amp; ATR (-{{ (((currentPrice - analysis.stopLoss) / currentPrice) * 100).toFixed(1) }}%).
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
}

.stock-chart-wrapper.is-fullscreen {
  position: fixed;
  inset: 12px;
  z-index: 100;
  background: #0B0F19;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow-y: auto;
}

/* Toolbar Pro */
.chart-pro-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 10px;
  padding: 8px 12px;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
}

.tf-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tf-btn {
  border: 1px solid #334155;
  background: #1E293B;
  color: #94A3B8;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.15s;
}
.tf-btn:hover {
  border-color: #475569;
  color: #F8FAFC;
}
.tf-btn.active {
  background: #38BDF8;
  border-color: #38BDF8;
  color: #0F172A;
}

.indicator-toggles {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.ind-chip {
  border: 1px solid #334155;
  background: #1E293B;
  color: #94A3B8;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: 0.15s;
}
.ind-chip:hover {
  border-color: #475569;
  color: #F8FAFC;
}
.ind-chip.active {
  border-color: #475569;
  color: #F8FAFC;
  background: #243044;
}

.ind-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.expand-wrapper {
  margin-left: auto;
}

.expand-btn {
  border: 1px solid #38BDF8;
  background: rgba(56, 189, 248, 0.1);
  color: #38BDF8;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: 0.15s;
  white-space: nowrap;
}
.expand-btn:hover {
  background: #38BDF8;
  color: #0F172A;
}

.tradingview-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #1E293B;
  min-height: 360px;
}

/* 3 Kolom Entry & Out Strip */
.entry-out-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.level-card {
  background: #0F172A;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #1E293B;
}
.level-card.entry { border-left: 4px solid #F59E0B; }
.level-card.tp { border-left: 4px solid #10B981; }
.level-card.sl { border-left: 4px solid #EF4444; }

.lvl-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lvl-badge {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}
.level-card.entry .lvl-badge { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
.level-card.tp .lvl-badge { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.level-card.sl .lvl-badge { background: rgba(239, 68, 68, 0.15); color: #EF4444; }

.lvl-title { font-size: 11.5px; color: #94A3B8; }
.lvl-price { font-size: 18px; font-weight: 700; color: #F8FAFC; margin: 2px 0; }
.level-card.entry .lvl-price { color: #F59E0B; }
.level-card.tp .lvl-price { color: #10B981; }
.level-card.sl .lvl-price { color: #EF4444; }

.lvl-desc { font-size: 11px; color: #64748B; line-height: 1.4; }
.lvl-desc b { color: #CBD5E1; }

@media (max-width: 768px) {
  .chart-pro-toolbar {
    gap: 8px;
  }
  .expand-wrapper {
    width: 100%;
  }
  .expand-btn {
    width: 100%;
    justify-content: center;
  }
  .entry-out-strip {
    grid-template-columns: 1fr;
  }
}
</style>
