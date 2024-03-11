import { get } from './base'

export function getRecommend () {
  // 需要跟后段设置的路由地址一样
  return get('/api/getRecommend')
}