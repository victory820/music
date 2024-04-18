import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { useStoreSongs } from '@/stores/songs'

BScroll.use(Slide)

export default function useMiniSlider() {
  const storeSongs = useStoreSongs()

  const refSliderWrapper = ref(null)
  const slide = ref()

  const fullScreen = computed(() => storeSongs.fullScreen)
  const playlist = computed(() => storeSongs.playList)
  const currentIndex = computed(() => storeSongs.currentIndex)
  // 是否显示迷你播放器
  const miniShow = computed(() => {
    return !fullScreen.value && !!playlist.value.length
  })

  onMounted(() => {
    let slideVal = null
    // 因为页面使用v-show所以不一定要展示
    watch(miniShow, async (newShow) => {
      if (newShow) {
        // 必须等dom渲染后
        await nextTick()

        if (!slideVal) {
          // 第一次才初始化
          slideVal = slide.value = new BScroll(refSliderWrapper.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false, // 不生成滚动动画
            bounce: false, // 滚动回弹
            probeTYpe: 2,
            slide: {
              autoplay: false // 是否自动播放
            }
          })
          slideVal.on('slidePageChanged', ({ pageX }) => {
            storeSongs.setCurrentIndex(pageX)
          })
        } else {
          slideVal.refresh()
        }
        slideVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (slideVal && miniShow.value) {
        slideVal.goToPage(newIndex, 0, 0)
      }
    })

    watch(playlist, async (newList) => {
      if (slideVal && miniShow.value && newList.length) {
        await nextTick()
        slideVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slide.value) {
      slide.value.destroy()
    }
  })

  return {
    slide,
    refSliderWrapper
  }
}
