<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  SparklesIcon, Cancel01Icon, ArrowUp01Icon,
  HelpCircleIcon, RefreshIcon, Target01Icon,
  Coins01Icon, Analytics01Icon
} from '@hugeicons/core-free-icons'
import { generateChatbotResponse, syncChatbotWithSqlite } from '../services/chatbotEngine.js'

const props = defineProps({
  currentStock: {
    type: Object,
    default: null,
  },
})

const isOpen = ref(false)
const isMinimized = ref(false)
const userPrompt = ref('')
const isTyping = ref(false)
const chatMessagesRef = ref(null)

const messages = ref([
  {
    id: 1,
    sender: 'ai',
    text: 'Halo! Saya **Saham AI Assistant** 📈.\n\nSaya terhubung langsung ke **SQLite Database Pasar BEI Hari Ini**. Saya siap menganalisis seluruh saham bursa (Grup Pak Prajogo, Pak Hapsoro, Bakrie, Salim, Big Banks, dan emiten lainnya).\n\nKamu bisa tanya seputar:\n• **Kondisi Pasar Hari Ini & IHSG**\n• **Rekomendasi Saham Berpotensi Terbang**\n• **Titik Entry, Stop Loss & Take Profit Saham Apa Saja**\n• **Bandarmologi & Modal Bandar (VWAP)**',
    time: 'Baru saja',
  },
])

const quickPrompts = [
  'Bagaimana kondisi market hari ini?',
  'Rekomendasi saham berpotensi terbang',
  'Berapa titik entry BREN & BRMS?',
  'Bagaimana aksi bandar saham RAJA?',
  'Simulasi alokasi lot modal 10 juta',
]

onMounted(() => {
  syncChatbotWithSqlite()
})

function scrollToBottom() {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    isMinimized.value = false
    scrollToBottom()
  }
}

function sendQuestion(text) {
  const query = text || userPrompt.value
  if (!query || !query.trim()) return

  // Tambahkan pesan user
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text: query.trim(),
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  })

  userPrompt.value = ''
  isTyping.value = true
  scrollToBottom()

  // Simulasi waktu respon AI realistis (300 - 600ms)
  setTimeout(() => {
    const aiAnswer = generateChatbotResponse(query, props.currentStock)
    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      text: aiAnswer,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    })
    isTyping.value = false
    scrollToBottom()
  }, 400)
}

// Format markdown sederhana (bold, italic, list)
function formatMessage(text) {
  if (!text) return ''
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n• /g, '<br>• ')
    .replace(/\n- /g, '<br>- ')
    .replace(/\n(\d+)\. /g, '<br>$1. ')
    .replace(/\n/g, '<br>')
  return html
}

function clearChat() {
  messages.value = [
    {
      id: Date.now(),
      sender: 'ai',
      text: `Percakapan telah direset. Saham yang sedang aktif: **${props.currentStock?.ticker || 'BBCA'}** (Rp ${props.currentStock?.price?.toLocaleString('id-ID') || 0}). Ada yang ingin kamu tanyakan?`,
      time: 'Baru saja',
    },
  ]
}

// Auto greeting saat saham aktif berganti
watch(
  () => props.currentStock?.ticker,
  (newTicker) => {
    if (newTicker && isOpen.value) {
      messages.value.push({
        id: Date.now(),
        sender: 'ai',
        text: `📌 Saham aktif berganti ke **${newTicker}** (Harga: Rp ${props.currentStock.price?.toLocaleString('id-ID')}). Kamu bisa ketik *"Berapa entry & SL ${newTicker}?"* untuk rencana trading cepat.`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      })
      scrollToBottom()
    }
  }
)
</script>

<template>
  <div class="chatbot-wrapper">
    <!-- Floating Action Button (FAB) -->
    <button
      v-if="!isOpen"
      class="fab-chat-btn"
      @click="toggleChat"
      aria-label="Buka Saham AI Chatbot"
      title="Tanya Saham AI Assistant"
    >
      <div class="fab-inner">
        <span class="fab-glow"></span>
        <HugeiconsIcon :icon="SparklesIcon" :size="20" style="color: #0F172A;" />
        <span class="fab-label">Tanya AI</span>
      </div>
      <span class="fab-online-dot"></span>
    </button>

    <!-- Chat Dialog Window -->
    <div
      v-if="isOpen"
      class="chat-window"
      :class="{ minimized: isMinimized }"
    >
      <!-- Chat Window Header -->
      <div class="chat-header">
        <div class="chat-header-title">
          <div class="ai-avatar">
            <HugeiconsIcon :icon="SparklesIcon" :size="16" style="color: #38BDF8;" />
          </div>
          <div>
            <div class="ai-name">
              <span>Saham AI Assistant</span>
              <span class="active-badge font-mono">{{ currentStock?.ticker || 'IDX' }}</span>
            </div>
            <div class="ai-status">
              <span class="status-indicator"></span>
              <span>Online • Siap Analisis Saham</span>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="chat-header-actions">
          <button class="head-btn" @click="clearChat" title="Reset Percakapan">
            <HugeiconsIcon :icon="RefreshIcon" :size="14" />
          </button>
          <button class="head-btn" @click="toggleChat" title="Tutup Chatbot">
            <HugeiconsIcon :icon="Cancel01Icon" :size="14" />
          </button>
        </div>
      </div>

      <!-- Chat Body (Messages List) -->
      <div v-show="!isMinimized" ref="chatMessagesRef" class="chat-body">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-row"
          :class="msg.sender"
        >
          <div v-if="msg.sender === 'ai'" class="msg-avatar">
            <HugeiconsIcon :icon="SparklesIcon" :size="12" style="color: #38BDF8;" />
          </div>
          <div class="message-bubble">
            <div class="message-text" v-html="formatMessage(msg.text)"></div>
            <span class="message-time font-mono">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message-row ai">
          <div class="msg-avatar">
            <HugeiconsIcon :icon="SparklesIcon" :size="12" style="color: #38BDF8;" />
          </div>
          <div class="typing-bubble">
            <span class="dot-typing"></span>
            <span class="dot-typing"></span>
            <span class="dot-typing"></span>
          </div>
        </div>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div v-show="!isMinimized" class="quick-prompts-bar">
        <div class="prompts-scroll">
          <button
            v-for="(p, idx) in quickPrompts"
            :key="idx"
            class="prompt-chip"
            @click="sendQuestion(p)"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <!-- Chat Input Field -->
      <div v-show="!isMinimized" class="chat-footer">
        <form @submit.prevent="sendQuestion()" class="chat-input-form">
          <input
            v-model="userPrompt"
            type="text"
            placeholder="Tanya harga entry, bandar, valuasi (cth: BBCA, BREN)..."
            class="chat-input"
            :disabled="isTyping"
          />
          <button
            type="submit"
            class="send-btn"
            :disabled="!userPrompt.trim() || isTyping"
            aria-label="Kirim Pesan"
          >
            <HugeiconsIcon :icon="ArrowUp01Icon" :size="16" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99;
}

/* Floating Action Button (FAB) */
.fab-chat-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fab-chat-btn:hover {
  transform: scale(1.06);
}

.fab-inner {
  background: linear-gradient(135deg, #38BDF8 0%, #0284C7 100%);
  color: #0F172A;
  padding: 12px 18px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 13.5px;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35);
  position: relative;
  overflow: hidden;
}

.fab-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 60%);
  animation: pulse-glow 3s infinite;
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

.fab-online-dot {
  position: absolute;
  top: 0;
  right: 4px;
  width: 10px;
  height: 10px;
  background: #10B981;
  border: 2px solid #0B0F19;
  border-radius: 50%;
  box-shadow: 0 0 8px #10B981;
}

/* Chat Dialog Window */
.chat-window {
  width: 380px;
  height: 540px;
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: pop-chat 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes pop-chat {
  from {
    transform: scale(0.92) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.chat-window.minimized {
  height: auto;
}

/* Header */
.chat-header {
  background: #111827;
  border-bottom: 1px solid #1E293B;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  display: grid;
  place-items: center;
}

.ai-name {
  font-size: 13px;
  font-weight: 800;
  color: #F8FAFC;
  display: flex;
  align-items: center;
  gap: 6px;
}

.active-badge {
  font-size: 10px;
  font-weight: 700;
  background: rgba(56, 189, 248, 0.15);
  color: #38BDF8;
  padding: 1px 5px;
  border-radius: 4px;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: #94A3B8;
  margin-top: 1px;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 6px #10B981;
}

.chat-header-actions {
  display: flex;
  gap: 6px;
}

.head-btn {
  border: 0;
  background: #1E293B;
  color: #94A3B8;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.15s;
}
.head-btn:hover {
  background: #334155;
  color: #FFFFFF;
}

/* Chat Body */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent;
}
.chat-body::-webkit-scrollbar {
  width: 4px;
}
.chat-body::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}

.message-row {
  display: flex;
  gap: 8px;
  max-width: 90%;
}
.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.message-row.ai {
  align-self: flex-start;
}

.msg-avatar {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #1E293B;
  display: grid;
  place-items: center;
  flex: none;
  margin-top: 2px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.5;
  position: relative;
}
.message-row.user .message-bubble {
  background: #38BDF8;
  color: #0F172A;
  font-weight: 600;
  border-bottom-right-radius: 2px;
}
.message-row.ai .message-bubble {
  background: #1E293B;
  color: #E2E8F0;
  border: 1px solid #334155;
  border-bottom-left-radius: 2px;
}

.message-text :deep(strong) {
  color: #38BDF8;
}
.message-row.user .message-text :deep(strong) {
  color: #0F172A;
}

.message-time {
  display: block;
  font-size: 9px;
  margin-top: 4px;
  text-align: right;
  opacity: 0.6;
}

/* Typing Indicator */
.typing-bubble {
  background: #1E293B;
  border: 1px solid #334155;
  padding: 8px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dot-typing {
  width: 5px;
  height: 5px;
  background: #38BDF8;
  border-radius: 50%;
  animation: typing 1s infinite alternate;
}
.dot-typing:nth-child(2) { animation-delay: 0.2s; }
.dot-typing:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  from { transform: translateY(0); opacity: 0.4; }
  to { transform: translateY(-4px); opacity: 1; }
}

/* Quick Prompts Bar */
.quick-prompts-bar {
  background: #0B0F19;
  border-top: 1px solid #1E293B;
  padding: 8px 12px;
  overflow-x: auto;
}
.prompts-scroll {
  display: flex;
  gap: 6px;
  width: max-content;
}
.prompt-chip {
  border: 1px solid #334155;
  background: #1E293B;
  color: #94A3B8;
  font-size: 10.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
  cursor: pointer;
  transition: 0.15s;
  white-space: nowrap;
}
.prompt-chip:hover {
  border-color: #38BDF8;
  color: #F8FAFC;
  background: #273549;
}

/* Chat Footer Input */
.chat-footer {
  padding: 10px 14px;
  background: #111827;
  border-top: 1px solid #1E293B;
}

.chat-input-form {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 4px 6px 4px 12px;
  transition: border-color 0.15s;
}
.chat-input-form:focus-within {
  border-color: #38BDF8;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: 0;
  outline: 0;
  color: #F8FAFC;
  font-size: 12px;
}
.chat-input::placeholder {
  color: #64748B;
  font-size: 11.5px;
}

.send-btn {
  width: 30px;
  height: 30px;
  border: 0;
  background: #38BDF8;
  color: #0F172A;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.15s;
}
.send-btn:hover:not(:disabled) {
  background: #7DD3FC;
}
.send-btn:disabled {
  background: #1E293B;
  color: #64748B;
  cursor: not-allowed;
}

/* Responsive Mobile Chatbot */
@media (max-width: 480px) {
  .chatbot-wrapper {
    bottom: 16px;
    right: 16px;
  }
  .chat-window {
    width: calc(100vw - 32px);
    height: 75vh;
    max-height: 520px;
  }
}
</style>
