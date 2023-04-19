import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import loadVersion from 'vite-plugin-package-version'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7900',
        // target: 'http://192.168.3.6:7900',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [react(), svgr(), tsconfigPaths(), loadVersion()]
})
