import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Plugin sederhana buat include partial HTML (navbar & footer)
// supaya nggak perlu copy-paste markup yang sama di 4 halaman.
// Pakai: <!--@include(nav)--> di dalam file HTML
function htmlInclude() {
  return {
    name: 'html-include',
    transformIndexHtml(html) {
      return html.replace(/<!--\s*@include\((.+?)\)\s*-->/g, (_, name) => {
        const partialPath = resolve(__dirname, `src/partials/${name.trim()}.html`)
        return readFileSync(partialPath, 'utf-8')
      })
    }
  }
}

export default defineConfig({
  plugins: [tailwindcss(), htmlInclude()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        contact: resolve(__dirname, 'contact.html'),
      }
    }
  }
})