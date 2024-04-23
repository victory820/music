import { computed, ref } from 'vue'
export default function useShortcut(props, refGroup) {
  const SHORT_HEIGHT = 18

  const refScroll = ref(null)

  const shortcutList = computed(() => {
    return props.singerList.map((item) => item.title)
  })

  // 滚动时候，根据开始滚动手指拖动然后赋值纵坐标
  const touch = {}

  function onShortcutTouchStart(e) {
    touch.y1 = e.touches[0].pageY
    // 保存开始时的下标
    touch.anchorIndex = e.target.dataset.index
    const clickIndex = parseInt(e.target.dataset.index)
    scrollTo(clickIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY

    const delta = ((touch.y2 - touch.y1) / SHORT_HEIGHT) | 0
    const currentIndex = touch.anchorIndex + delta
    scrollTo(currentIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEle = refGroup.value.children[index]
    refScroll.value.scroll.scrollToElement(targetEle, 0)
  }

  function onShortcutTouchEnd(e) {}

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd,
    refScroll
  }
}
