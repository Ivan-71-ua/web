import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    istanbul({
      include: 'src/**/*',
      exclude: ['node_modules', 'cypress', 'dist'],
      extension: ['.ts', '.tsx'],
      cypress: true,
      requireEnv: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
