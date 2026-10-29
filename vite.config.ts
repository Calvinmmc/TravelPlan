import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 部署到 GitHub Pages 时站点在 /<仓库名>/ 下，由部署流程通过 BASE_PATH 传入
  base: process.env.BASE_PATH ?? '/',
  server: { port: 5173 },
})
