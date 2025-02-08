import { defineConfig } from 'rolldown-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  experimental: {
    enableNativePlugin: true,
  },
})

