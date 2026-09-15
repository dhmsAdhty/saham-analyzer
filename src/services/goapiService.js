// GoAPI.io Service Connector
// Dokumentasi: https://api.goapi.io

const STORAGE_KEY = 'goapi_idx_api_key'

export function getGoApiKey() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setGoApiKey(key) {
  if (typeof window === 'undefined') return
  if (key) {
    localStorage.setItem(STORAGE_KEY, key.trim())
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export async function testGoApiConnection(apiKey) {
  const key = apiKey || getGoApiKey()
  if (!key) return { ok: false, message: 'API Key belum diisi' }

  try {
    const res = await fetch(`/api/goapi/stock/idx/trending?api_key=${encodeURIComponent(key)}`)
    const data = await res.json()
    if (data.status === 'success') {
      return { ok: true, data: data.data, message: 'Koneksi GoAPI IDX Berhasil!' }
    } else {
      return { ok: false, message: data.message || 'API Key GoAPI tidak valid' }
    }
  } catch (err) {
    return { ok: false, message: `Gagal terhubung ke GoAPI: ${err.message}` }
  }
}

export async function fetchGoApiTrending(apiKey) {
  const key = apiKey || getGoApiKey()
  if (!key) return null

  try {
    const res = await fetch(`/api/goapi/stock/idx/trending?api_key=${encodeURIComponent(key)}`)
    const json = await res.json()
    if (json.status === 'success') {
      return json.data
    }
  } catch (err) {
    console.warn('GoAPI trending fetch error:', err)
  }
  return null
}
