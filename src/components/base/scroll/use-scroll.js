import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(ObserveDOM)
export default function useScroll(wrapper, options) {
  const box = ref(null)

  onMounted(() => {
    box.value = new BScroll(wrapper.value, { observeDOM: true, ...options })
  })

  onUnmounted(() => {
    box.value.destroy()
  })
}
