import { setLocal, getLocal, removeLocal } from './storage'

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function save(item, key, compare, maxLen) {
  // 获取本地存储的收藏数据
  const items = getLocal(key) || []
  // 不存在收藏列表就添加
  insertArray(items, item, compare, maxLen)
  setLocal(key, items)
  return items
}

export function remove(key, compare) {
  const items = getLocal(key) || []
  deleteFromArray(items, compare)
  setLocal(key, items)
  return items
}

// 从本地获取收藏列表
export function load(key) {
  return getLocal(key) || []
}

export function clearLocal(key) {
  removeLocal(key)
  return []
}
