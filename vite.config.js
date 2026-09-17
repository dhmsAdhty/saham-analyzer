import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: true,
    proxy: {
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*'
        }
      },
      '/api/goapi': {
        target: 'https://api.goapi.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/goapi/, ''),
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      },
      '/api/db': {
        target: 'http://127.0.0.1:5050',
        changeOrigin: true
      }
    }
  }
})
