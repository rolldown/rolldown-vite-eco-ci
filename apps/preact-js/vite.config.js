import { defineConfig } from 'rolldown-vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  experimental: {
    enableNativePlugin: true
  }
})
