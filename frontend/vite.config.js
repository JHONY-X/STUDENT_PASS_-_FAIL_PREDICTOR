import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/STUDENT_PASS_-_FAIL_PREDICTOR/',   // ← comment this line
  plugins: [react()],
})
