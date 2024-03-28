import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import lazyPlugin from 'vue3-lazy'

import './assets/styles/index.less'

import defaultImg from '@/assets/images/default.png'

import { loading } from '@/components/base/loading/directive'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(lazyPlugin, {
    loading: defaultImg
  })
  .directive('loading', loading)
  .mount('#app')
