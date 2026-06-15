import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'Clgproject2622-main/src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  root: path.resolve(__dirname, 'Clgproject2622-main'),
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      // Map @/ to the src directory
      {
        find: /^@\/(.*)$/,
        replacement: path.resolve(__dirname, './Clgproject2622-main/src/$1'),
      },
      // Automatically strip version specifiers from versioned package imports
      {
        find: /^((?:@[^/]+\/)?[^@/]+)@[\d\.]+(\/.*)?$/,
        replacement: '$1$2',
      }
    ],
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'motion'],
    exclude: [],
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
})
