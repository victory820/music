import { ref, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
  const GROUP_TITLE_HEIGHT = 30

  const refGroup = ref(null)
  // 存储每组的高度，判断滚动的数据在哪个区间，然后决定哪个字母显示
  const allHeights = ref([])
  // y轴滚动的位置
  const scrollY = ref(0)
  // 所在组的下标
  const currentIndex = ref(0)

  // 滚动的偏移量
  const distance = ref(0)

  const groupTitle = computed(() => {
    if (currentIndex.value < 0) {
      return ''
    }
    const current = props.singerList[currentIndex.value]
    return current ? current.title : ''
  })

  const groupStyle = computed(() => {
    const distanceVal = distance.value
    const diff =
      distanceVal > 0 && distanceVal <= GROUP_TITLE_HEIGHT ? distanceVal - GROUP_TITLE_HEIGHT : 0
    return { transform: `translate3d(0, ${diff}px, 0)` }
  })

  // 数据改变时，重新获取高度
  watch(
    () => props.singerList,
    async () => {
      await nextTick()
      calculate()
    }
  )

  watch(scrollY, (newY) => {
    // 滚动到哪个区间
    const length = allHeights.value.length
    for (let i = 0; i < length - 1; i++) {
      const heightTop = allHeights.value[i]
      const heightBottom = allHeights.value[i + 1]
      // 滚动到哪个区间
      if (newY >= heightTop && newY < heightBottom) {
        currentIndex.value = i
        // 向上顶时距离顶部的距离
        distance.value = heightBottom - newY
      }
    }
  })

  //
  function calculate() {
    const lis = refGroup.value.children
    let tempH = 0
    allHeights.value = []
    // 添加初始位置高度
    allHeights.value.push(tempH)
    for (let i = 0; i < lis.length; i++) {
      const current = lis[i]
      // 累加高度，才是整个屏幕里数据高度
      tempH += current.clientHeight
      allHeights.value.push(tempH)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return { refGroup, onScroll, groupTitle, groupStyle, currentIndex }
}
