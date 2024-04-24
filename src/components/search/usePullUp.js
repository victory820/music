import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'

import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)
export default function usePullUp(requestData) {
  const refRoot = ref(null)
  const scroll = ref(null)
  const isLoadPull = ref(false)

  const initBScroll = () => {
    async function pullingHandler() {
      console.log('----2222', scroll.value)
      isLoadPull.value = true
      await requestData()
      scroll.value.finishPullUp()
      scroll.value.refresh()
      isLoadPull.value = false
    }

    const scrollVal = (scroll.value = new BScroll(refRoot.value, {
      pullUpLoad: true,
      observeDom: true,
      click: true
    }))

    console.log('-1-', scrollVal)
    scrollVal.on('pullingUp', pullingHandler)
    // scrollVal.on('scroll', () => {
    //   console.log('滚动了====')
    // })
  }

  onMounted(() => {
    initBScroll()
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  onDeactivated(() => {
    scroll.value.disable()
  })

  return {
    refRoot,
    isLoadPull,
    scroll
  }
}
