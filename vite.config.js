import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        // 可设置全局变量
        javascriptEnabled: true,
        additionalData: `@import "@/assets/styles/variable.less";@import "@/assets/styles/mixin.less";`
      }
    },
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
