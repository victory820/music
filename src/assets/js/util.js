export function shuffle(source) {
  // 不动原始数据
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    // 获取一个随机数据
    const j = getRandomInt(i)
    // 交换数据
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}
// 交换数据
function swap(arr, x, y) {
  const temp = arr[x]
  arr[x] = arr[y]
  arr[y] = temp
}

// 格式化时间
export function formatTime(interval) {
  // 不考虑小时
  // 向下取整
  interval = interval | 0
  const minute = (((interval / 60) | 0) + '').padStart(2, '0')
  const second = ((interval % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}
