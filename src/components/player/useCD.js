import { ref, computed, watch } from 'vue'
import { useStoreSongs } from '@/stores/songs'

export default function useCD() {
  const store = useStoreSongs()

  const refCD = ref(null)
  const refCDImage = ref(null)

  const playing = computed(() => {
    return store.playing
  })
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      // 暂停状态
      syncTransform(refCDImage.value, refCD.value)
    }
  })

  function syncTransform(inner, outer) {
    const innerTransform = getComputedStyle(inner).transform
    const outerTransform = getComputedStyle(outer).transform
    // 如果已有旋转数据，需要叠加原先数据
    outer.style.transform =
      outerTransform === 'none' ? innerTransform : innerTransform.concat(' ', outerTransform)
  }

  return {
    cdCls,
    refCD,
    refCDImage
  }
}
