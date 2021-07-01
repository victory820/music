import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(Slide)

export default function useSlider (wrapperRef) {
  // 变成响应式，默认值为null
  const slider = ref(null)
  // 初始化值为0
  const currentPageIndex = ref(0)
  // 在setup中的生命周期钩子
  onMounted(() => {
    // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
    // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
    // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
    // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      slide: true,
      momentum: false,
      bounce: false,
      probeType: 2
    })
    sliderVal.on('slideWillChange', (page) => {
      // 这里别忘了是value因为是基本数据类型
      currentPageIndex.value = page.pageX
    })
  })
  onUnmounted(() => {
    // 销毁 BetterScroll，解绑事件
    slider.value && slider.value.destroy()
  })

  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })

  // 向外暴露组件对象和当前页
  return {
    slider,
    currentPageIndex
  }
}
