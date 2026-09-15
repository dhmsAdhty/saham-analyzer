<script setup>
import { ref, onMounted, watch } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  SparklesIcon, News01Icon, CheckmarkCircle01Icon,
  AlertCircleIcon, RefreshIcon, Link01Icon,
  InformationCircleIcon, Target01Icon
} from '@hugeicons/core-free-icons'
import { fetchAggregatedStockNews } from '../services/newsAiService.js'

const props = defineProps({
  stock: {
    type: Object,
    required: true,
  },
})

const isLoading = ref(false)
const newsResult = ref(null)

async function loadNewsData() {
  if (!props.stock?.ticker) return
  isLoading.value = true
  try {
    const data = await fetchAggregatedStockNews(props.stock.ticker, props.stock.name)
    newsResult.value = data
  } catch (err) {
    console.error('Failed to load aggregated news', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadNewsData()
})

watch(
  () => props.stock?.ticker,
  () => {
    loadNewsData()
  }
)
</script>

<template>
  <div class="news-ai-container">
    <!-- 1. AI Decision & Sentiment Synthesis Header -->
    <div v-if="newsResult?.aiAnalysis" class="ai-synthesis-card">
      <div class="ai-badge-row">
        <div class="ai-pill">
          <HugeiconsIcon :icon="SparklesIcon" :size="15" style="color: #38BDF8;" />
          <span>AI MARKET SENTIMENT SYNTHESIS</span>
        </div>
        <div class="tone-pill" :style="{ background: newsResult.aiAnalysis.toneColor }">
          {{ newsResult.aiAnalysis.overallTone }}
        </div>
      </div>

      <!-- AI Verdict Banner -->
      <div class="ai-verdict-box">
        <div class="verdict-head">
          <HugeiconsIcon :icon="CheckmarkCircle01Icon" :size="18" style="color: #10B981; flex: none;" />
          <div>
            <h3 class="verdict-title">{{ newsResult.aiAnalysis.aiVerdict }}</h3>
            <p class="verdict-desc">{{ newsResult.aiAnalysis.executiveSummary }}</p>
          </div>
        </div>

        <!-- Sentiment Bar Meter -->
        <div class="sentiment-meter-bar">
          <div class="bar-labels">
            <span style="color: #10B981; font-weight: 700;">Sentimen Positif ({{ newsResult.aiAnalysis.bullPct }}%)</span>
            <span style="color: #EF4444; font-weight: 700;">Waspada / Koreksi ({{ newsResult.aiAnalysis.bearPct }}%)</span>
          </div>
          <div class="progress-track">
            <div class="fill-bull" :style="{ width: `${newsResult.aiAnalysis.bullPct}%` }"></div>
            <div class="fill-bear" :style="{ width: `${newsResult.aiAnalysis.bearPct}%` }"></div>
          </div>
        </div>

        <!-- AI Bullet Key Takeaways -->
        <div class="key-takeaways-list">
          <div v-for="(takeaway, idx) in newsResult.aiAnalysis.keyTakeaways" :key="idx" class="takeaway-item">
            <span class="takeaway-num">{{ idx + 1 }}</span>
            <span>{{ takeaway }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Live Aggregated News Feed -->
    <div class="news-feed-section">
      <div class="section-head">
        <div style="display: flex; align-items: center; gap: 8px;">
          <HugeiconsIcon :icon="News01Icon" :size="18" style="color: #38BDF8;" />
          <h3 class="section-title">Semua Berita &amp; Isu Terkini Saham {{ stock.ticker }} ({{ newsResult?.totalArticles || 0 }} Berita)</h3>
        </div>
        <button class="refresh-news-btn" :disabled="isLoading" @click="loadNewsData">
          <HugeiconsIcon :icon="RefreshIcon" :size="14" :class="{ spinning: isLoading }" />
          <span>{{ isLoading ? 'Menyegarkan...' : 'Perbarui Berita' }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="news-loading font-mono">
        <div class="mini-spinner"></div>
        <span>Menghubungkan ke live news stream BEI &amp; portal finansial...</span>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="newsResult?.articles?.length" class="articles-grid">
        <div
          v-for="(art, idx) in newsResult.articles"
          :key="idx"
          class="article-card"
        >
          <div class="art-meta-row">
            <span class="publisher-tag">{{ art.publisher }}</span>
            <span class="pub-date font-mono">{{ art.publishedAt }}</span>
            <span :class="['sentiment-chip', art.sentiment === 'Bullish' ? 'bull' : art.sentiment === 'Bearish' ? 'bear' : 'neut']">
              {{ art.sentiment }}
            </span>
          </div>
          <h4 class="art-title">
            <a v-if="art.link" :href="art.link" target="_blank" rel="noopener noreferrer">
              {{ art.title }}
              <HugeiconsIcon :icon="Link01Icon" :size="12" style="display: inline; margin-left: 4px;" />
            </a>
            <span v-else>{{ art.title }}</span>
          </h4>
          <p class="art-summary">{{ art.summary }}</p>
        </div>
      </div>

      <div v-else class="empty-news">
        <p>Belum ada berita baru untuk saham {{ stock.ticker }} saat ini.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-ai-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* AI Synthesis Card */
.ai-synthesis-card {
  background: #111827;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.ai-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.ai-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(56, 189, 248, 0.12);
  color: #38BDF8;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 0.04em;
}

.tone-pill {
  color: #0F172A;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

.ai-verdict-box {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 12px;
  padding: 18px 20px;
}

.verdict-head {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.verdict-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #F8FAFC;
}

.verdict-desc {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: #94A3B8;
  line-height: 1.5;
}

/* Sentiment Bar */
.sentiment-meter-bar {
  margin-bottom: 16px;
}
.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  margin-bottom: 6px;
}
.progress-track {
  height: 8px;
  background: #1E293B;
  border-radius: 99px;
  display: flex;
  overflow: hidden;
}
.fill-bull {
  background: #10B981;
  transition: width 0.3s ease;
}
.fill-bear {
  background: #EF4444;
  transition: width 0.3s ease;
}

/* Takeaways */
.key-takeaways-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #1E293B;
  padding-top: 14px;
}

.takeaway-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 12.5px;
  color: #CBD5E1;
  line-height: 1.45;
}

.takeaway-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1E293B;
  color: #38BDF8;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
  flex: none;
}

/* News Feed Section */
.news-feed-section {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #F8FAFC;
}

.refresh-news-btn {
  border: 1px solid #334155;
  background: #1E293B;
  color: #94A3B8;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: 0.15s;
}
.refresh-news-btn:hover:not(:disabled) {
  border-color: #38BDF8;
  color: #F8FAFC;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.article-card {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
}
.article-card:hover {
  border-color: #334155;
}

.art-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.publisher-tag {
  color: #38BDF8;
  font-weight: 700;
}
.pub-date {
  color: #64748B;
}

.sentiment-chip {
  margin-left: auto;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}
.sentiment-chip.bull { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.sentiment-chip.bear { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
.sentiment-chip.neut { background: rgba(148, 163, 184, 0.15); color: #94A3B8; }

.art-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.4;
}
.art-title a {
  color: #F8FAFC;
  text-decoration: none;
}
.art-title a:hover {
  color: #38BDF8;
}

.art-summary {
  margin: 0;
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.45;
}

.news-loading {
  padding: 30px;
  text-align: center;
  color: #94A3B8;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(56, 189, 248, 0.3);
  border-top-color: #38BDF8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinning {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 880px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
