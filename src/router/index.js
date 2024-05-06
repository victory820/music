import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import('@/views/Recommend.vue')
const Singer = () => import('@/views/Singer.vue')
const TopList = () => import('@/views/TopList.vue')
const Search = () => import('@/views/Search.vue')
const SingerDetail = () => import('@/views/SingerDetail.vue')
const AlbumDetail = () => import('@/views/Album.vue')
const TopDetail = () => import('@/views/TopDetail.vue')
const UserCenter = () => import('@/views/UserCenter.vue')

const router = createRouter({
  history: createWebHashHistory(process.env.NODE_ENV === 'production' ? '/music/' : '/'),
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
      component: TopList,
      children: [
        {
          path: ':id',
          component: TopDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      components: {
        user: UserCenter
      }
    }
  ]
})

export default router
