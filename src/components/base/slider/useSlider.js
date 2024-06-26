import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
export function useSlider(wrapper) {
  BScroll.use(Slide)

  const slideVal = ref()
  const currentPageIndex = ref(0)

  onMounted(() => {
    slideVal.value = new BScroll(wrapper.value, {
      scrollX: true,
      scrollY: false,
      slide: true,
      momentum: false,
      bounce: false,
      probeType: 3
    })

    slideVal.value.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slideVal.value.destroy()
  })

  onActivated(() => {
    slideVal.value.enable()
    slideVal.value.refresh()
  })
  onDeactivated(() => {
    slideVal.value.disable()
  })

  return {
    slideVal,
    currentPageIndex
  }
}
