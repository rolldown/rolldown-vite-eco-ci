// @ts-ignore
import { defineConfig } from 'rolldown-vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  experimental: {
    enableNativePlugin: true
  }
})
