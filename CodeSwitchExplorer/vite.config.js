import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: { loader: { '.js': 'jsx' }, include: /src\/.*\.js$/ },
  // ensure dev optimizer parses JSX in .js files
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: { host: '127.0.0.1', port: 5173 },
  // To serve under http://CodeSwitchExplorer:5173, add to OS hosts:
  // 127.0.0.1 CodeSwitchExplorer
  // Then run: npm run dev -- --host CodeSwitchExplorer --port 5173
})
