import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

export function getSearch(query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
