import { createApp } from 'vue'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'

import App from './App.vue'
import router from './router'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/noResult/directive'

import './assets/styles/index.less'

import defaultImg from '@/assets/images/logo.png'

const app = createApp(App)
const pinia = createPinia()

// eslint-disable-next-line no-undef
// if (process.env.NODE_ENV === 'production') {
//   // 线上开启日志
//   pinia.use(createLogger())
// }
app
  .use(pinia)
  .use(router)
  .use(lazyPlugin, {
    loading: defaultImg
  })
  .directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
