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
