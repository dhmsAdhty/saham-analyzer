<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  ArrowUp01Icon, ArrowDown01Icon, Chart01Icon,
  GlobalIcon, Coins01Icon, AlertCircleIcon,
} from '@hugeicons/core-free-icons'

defineProps({
  ihsg: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <header class="ihsg-banner">
    <div class="ihsg-content">
      <!-- Title & Live Indicator -->
      <div class="ihsg-main">
        <div class="live-tag">
          <span class="pulse-dot"></span>
          <span>IDX COMPOSITE</span>
        </div>
        <div class="ihsg-value-group">
          <span class="ihsg-points font-mono">
            {{ Number(ihsg.price || ihsg.current || 7325.40).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </span>
          <span :class="['change-pill', (ihsg.change || 0) >= 0 ? 'up' : 'down']">
            <HugeiconsIcon :icon="(ihsg.change || 0) >= 0 ? ArrowUp01Icon : ArrowDown01Icon" :size="14" />
            <span>{{ (ihsg.change || 0) >= 0 ? '+' : '' }}{{ ihsg.change || 0 }} ({{ (ihsg.changePct || 0) >= 0 ? '+' : '' }}{{ ihsg.changePct || 0 }}%)</span>
          </span>
        </div>
      </div>

      <!-- Market Stats (Flow, Volume, Levels) -->
      <div class="ihsg-stats">
        <div class="stat-col">
          <span class="stat-title">Arus Asing (Foreign Flow)</span>
          <span class="stat-val font-mono" style="color: #10B981;">{{ ihsg.foreignFlow || '+Rp 640 Miliar' }}</span>
        </div>
        <div class="stat-col">
          <span class="stat-title">Support IHSG</span>
          <span class="stat-val font-mono">{{ Number(ihsg.support1 || ihsg.support || 7280).toLocaleString('id-ID') }} – {{ Number(ihsg.support2 || (ihsg.support1 ? ihsg.support1 * 0.99 : 7220)).toLocaleString('id-ID') }}</span>
        </div>
        <div class="stat-col">
          <span class="stat-title">Resistance IHSG</span>
          <span class="stat-val font-mono">{{ Number(ihsg.resistance1 || ihsg.resistance || 7360).toLocaleString('id-ID') }} – {{ Number(ihsg.resistance2 || (ihsg.resistance1 ? ihsg.resistance1 * 1.01 : 7420)).toLocaleString('id-ID') }}</span>
        </div>
        <div class="stat-col desktop-only">
          <span class="stat-title">Status Pasar</span>
          <span class="stat-val" style="color: #38BDF8; font-weight: 600;">{{ ihsg.status }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.ihsg-banner {
  background: #111827;
  border-bottom: 1px solid #1F2937;
  padding: 12px 28px;
}

.ihsg-content {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.ihsg-main {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.live-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.12);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.ihsg-value-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ihsg-points {
  font-size: 20px;
  font-weight: 700;
  color: #F9FAFB;
}

.change-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}
.change-pill.up { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.change-pill.down { background: rgba(239, 68, 68, 0.15); color: #EF4444; }

.ihsg-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-title {
  font-size: 10.5px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.stat-val {
  font-size: 12.5px;
  font-weight: 600;
  color: #E5E7EB;
}

@media (max-width: 768px) {
  .ihsg-banner { padding: 10px 16px; }
  .desktop-only { display: none; }
  .ihsg-stats { gap: 14px; }
}
</style>
