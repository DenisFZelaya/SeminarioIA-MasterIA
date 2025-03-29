import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'proyecto-d1.site',  // Tu dominio principal
      'www.proyecto-d1.site' // Si usas versión con www
    ],
    // Otras configuraciones del servidor...
  }
})