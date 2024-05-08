import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { registerRoutesPlugin } from './backend/middleware'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './env',
  base: process.env.NODE_ENV === 'production' ? '/music' : '/',
  css: {
    preprocessorOptions: {
      less: {
        // 可设置全局变量
        javascriptEnabled: true,
        additionalData: `@import "@/assets/styles/variable.less";@import "@/assets/styles/mixin.less";`
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    // 使用插件形式自定义中间件
    registerRoutesPlugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true
  },
  build: {
    assetsDir: 'static',
    rollupOptions: {
      output: {
        manualChunks: {
          'recommend-page': ['@/views/Recommend.vue'],
          'singer-page': ['@/views/Singer.vue'],
          'singer-detail-page': ['@/views/SingerDetail.vue'],
          'top-list-page': ['@/views/TopList.vue'],
          'top-detail-page': ['@/views/TopDetail.vue'],
          'search-page': ['@/views/Search.vue'],
          'album-detail-page': ['@/views/Album.vue'],
          'user-center-page': ['@/views/UserCenter.vue']
        }
      }
    }
  }
})
