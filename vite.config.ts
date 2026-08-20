import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 서브패스 배포: https://sooyachoco.github.io/D2A_designsystem/
export default defineConfig({
  plugins: [react()],
  base: '/D2A_designsystem/',
})
