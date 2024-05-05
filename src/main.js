import { createApp } from 'vue'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'

import App from './App.vue'
import router from './router'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/noResult/directive'

import './assets/styles/index.less'

import defaultImg from '@/assets/images/logo.png'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/const'
import { load, saveAll } from '@/assets/js/arrayStore'
import { processSongs } from '@/service/song.js'
import { useStoreSongs } from '@/stores/songs'

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

const storeSongs = useStoreSongs()

// 本地存储有歌曲从新获取歌曲播放地址（防止过期无法播放）
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    storeSongs.setFavoriteList(songs)
    saveAll(songs, FAVORITE_KEY)
  })
}
const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    storeSongs.setPlayHistory(songs)
    saveAll(songs, PLAY_KEY)
  })
}
