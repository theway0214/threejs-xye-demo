import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import transformerDirective from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

import Unocss from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Unocss({
      transformers: [transformerVariantGroup(), transformerDirective()],
      hmrTopLevelAwait: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      three: fileURLToPath(new URL('./node_modules/three', import.meta.url)),
    },
  },
})
