import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

export default function useCd () {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)
  // const cdRef = ref(null)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform (wrapper, inner) {
    // 如果是第一次点击直接取内层图片的旋转角度
    // 暂定后在播放，这时旋转角度应该是内层和外层的和
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : (innerTransform.concat(' ', wrapperTransform))
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
