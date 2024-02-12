import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@environment": path.resolve(__dirname, "./src/environments"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@interceptors": path.resolve(__dirname, "./src/interceptors"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@redux": path.resolve(__dirname, "./src/redux"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@views": path.resolve(__dirname, "./src/views"),
    },
  },
  server: {
    open: false,
    port: 3000,
  },
})
