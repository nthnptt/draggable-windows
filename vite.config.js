import { defineConfig } from 'vite'

export default defineConfig({
    base: "draggable-windows/",
    server: {
      watch: {
        usePolling: true
      }
    }
  })