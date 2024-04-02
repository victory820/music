import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(ObserveDOM)
export default function useScroll(wrapper, options, emit) {
  const box = ref(null)

  onMounted(() => {
    box.value = new BScroll(wrapper.value, { observeDOM: true, ...options })

    // 滚动时返回事件
    if (options.probeType > 0) {
      box.value.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    box.value.destroy()
  })

  // 将实例返回出去
  return box
}
