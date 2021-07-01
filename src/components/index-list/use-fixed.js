import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed (props) {
  const TITLE_HEIGHT = 30
  // 拿到容器
  const groupRef = ref(null)

  // 存放所有高度的数组
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    // 当滚动到顶部，就不显示分组标题
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    // 标题固定高度是30
    // 滚动的距离大于0小于标题高度
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  watch(() => props.data, async () => {
    // 只有等页面渲染完成在计算高度
    await nextTick()
    calculate()
  })
  // 计算是落在哪个区间
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heighTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heighTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  // 计算每个组（按照字母分开的数据）的高度
  function calculate () {
    // 拿到所有孩子
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let initH = 0
    // 先清空在添加
    listHeightsVal.length = 0
    listHeightsVal.push(initH)
    for (let i = 0; i < list.length; i++) {
      initH += list[i].clientHeight
      listHeightsVal.push(initH)
    }
  }

  function onScroll (pos) {
    scrollY.value = -pos.y
  }
  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
