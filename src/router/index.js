import { createRouter, createWebHashHistory } from 'vue-router'

import Recommend from '@/views/Recommend.vue'
import Singer from '@/views/Singer.vue'
import TopList from '@/views/TopList.vue'
import Search from '@/views/Search.vue'
import SingerDetail from '@/views/SingerDetail.vue'
import AlbumDetail from '@/views/Album.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: AlbumDetail
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/top-list',
      component: TopList
    },
    {
      path: '/search',
      component: Search
    }
  ]
})

export default router
