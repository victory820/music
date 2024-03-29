import { createApp } from 'vue'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'

import App from './App.vue'
import router from './router'
import loadingDirective from '@/components/base/loading/directive'

import './assets/styles/index.less'

import defaultImg from '@/assets/images/default.png'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(lazyPlugin, {
    loading: defaultImg
  })
  .directive('loading', loadingDirective)
  .mount('#app')
