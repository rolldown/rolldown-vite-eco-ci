import { defineConfig } from 'rolldown-vite'
import { qwikVite } from '@builder.io/qwik/optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    qwikVite({
      csr: true,
      client: {
        outDir: "dist/client",
      }
    }),
  ],
  experimental: {
    enableNativePlugin: true,
  }
})
