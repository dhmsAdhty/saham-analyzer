<script setup>
import { ref, onMounted } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Settings02Icon, Key01Icon, CheckmarkCircle01Icon,
  AlertCircleIcon, RefreshIcon, Cancel01Icon,
  Link01Icon, InformationCircleIcon,
} from '@hugeicons/core-free-icons'
import { getGoApiKey, setGoApiKey, testGoApiConnection } from '../services/goapiService.js'

const emit = defineEmits(['close', 'saved'])

const apiKeyInput = ref('')
const isTesting = ref(false)
const testResult = ref(null)

onMounted(() => {
  apiKeyInput.value = getGoApiKey()
})

async function testConnection() {
  if (!apiKeyInput.value.trim()) {
    testResult.value = { ok: false, message: 'Masukkan API Key GoAPI terlebih dahulu.' }
    return
  }
  isTesting.value = true
  testResult.value = null
  try {
    const res = await testGoApiConnection(apiKeyInput.value.trim())
    testResult.value = res
  } finally {
    isTesting.value = false
  }
}

function saveKey() {
  setGoApiKey(apiKeyInput.value.trim())
  emit('saved', apiKeyInput.value.trim())
}
</script>

<template>
  <div class="modal-wrap">
    <div class="scrim" @click="emit('close')"></div>
    <div class="modal" style="z-index: 65; max-width: 500px;">
      <div class="modal-head">
        <div style="display: flex; align-items: center; gap: 8px;">
          <HugeiconsIcon :icon="Key01Icon" :size="18" style="color: #38BDF8;" />
          <h3 style="margin: 0; font-size: 17px; color: #F8FAFC;">Integrasi GoAPI.io (IDX Feed)</h3>
        </div>
        <button class="x-btn" @click="emit('close')" aria-label="Tutup">
          <HugeiconsIcon :icon="Cancel01Icon" :size="16" />
        </button>
      </div>

      <div class="modal-body">
        <p style="font-size: 12.5px; color: #94A3B8; margin: 0 0 16px; line-height: 1.5;">
          Hubungkan sistem ini ke penyedia data <b>GoAPI.io</b> untuk mengaktifkan sinkronisasi otomatis data Bursa Efek Indonesia (BEI/IDX).
        </p>

        <!-- Cara Mendapatkan Key -->
        <div class="info-guide-box">
          <div style="font-weight: 700; color: #38BDF8; margin-bottom: 4px; font-size: 12px; display: flex; align-items: center; gap: 6px;">
            <HugeiconsIcon :icon="InformationCircleIcon" :size="14" />
            Cara Mendapatkan API Key:
          </div>
          <ol style="margin: 0; padding-left: 18px; font-size: 11.5px; color: #CBD5E1; line-height: 1.5;">
            <li>Daftar akun gratis di <a href="https://goapi.io" target="_blank" style="color: #38BDF8; text-decoration: underline;">goapi.io</a></li>
            <li>Buka menu <b>Dashboard &gt; API Keys</b></li>
            <li>Copy API Key Anda dan tempel di kolom bawah ini</li>
          </ol>
        </div>

        <div class="field" style="margin-top: 16px;">
          <label style="display: block; font-size: 12px; font-weight: 600; color: #94A3B8; margin-bottom: 6px;">
            GoAPI.io API Key
          </label>
          <input
            v-model="apiKeyInput"
            type="text"
            placeholder="cth: api_dev_xxxxxxxxxxxxxxxxxxxx"
            class="api-input font-mono"
          />
        </div>

        <!-- Feedback Tes -->
        <div v-if="testResult" :class="['test-feedback', testResult.ok ? 'ok' : 'err']">
          <HugeiconsIcon :icon="testResult.ok ? CheckmarkCircle01Icon : AlertCircleIcon" :size="16" />
          <span>{{ testResult.message }}</span>
        </div>

        <!-- Modal Actions -->
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button
            type="button"
            class="btn-test"
            :disabled="isTesting"
            @click="testConnection"
          >
            <span v-if="isTesting">Memeriksa...</span>
            <span v-else style="display: flex; align-items: center; gap: 6px;">
              <HugeiconsIcon :icon="RefreshIcon" :size="14" /> Tes Koneksi
            </span>
          </button>
          <button
            type="button"
            class="btn-save"
            @click="saveKey"
          >
            Simpan & Aktifkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-wrap {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 16px;
}
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}
.modal {
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: pop 0.15s ease-out;
}
@keyframes pop {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-head {
  padding: 18px 20px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1F2937;
}
.x-btn {
  border: 0;
  background: #1E293B;
  color: #94A3B8;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.x-btn:hover {
  background: #334155;
  color: #FFFFFF;
}
.modal-body {
  padding: 18px 20px 22px;
}
.info-guide-box {
  background: #0F172A;
  border: 1px solid #1E293B;
  border-radius: 10px;
  padding: 12px 14px;
}
.api-input {
  width: 100%;
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 10px 14px;
  color: #F8FAFC;
  font-size: 13px;
  outline: 0;
  box-sizing: border-box;
}
.api-input:focus {
  border-color: #38BDF8;
}
.test-feedback {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.test-feedback.ok {
  background: rgba(16, 185, 129, 0.12);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.test-feedback.err {
  background: rgba(239, 68, 68, 0.12);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
}
.btn-test {
  border: 1px solid #334155;
  background: #1E293B;
  color: #CBD5E1;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}
.btn-test:hover:not(:disabled) {
  border-color: #475569;
  background: #273549;
}
.btn-save {
  border: 0;
  background: #38BDF8;
  color: #0F172A;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  flex: 1.2;
}
.btn-save:hover {
  background: #7DD3FC;
}
</style>
