import { createBlock, mergeProps, withCtx, renderSlot, ref, computed, nextTick, watch } from 'vue'
import Scroll from '@/components/base/scroll/Index.vue'

import { useStoreSongs } from '@/stores/songs'

// 有可能第一次无法滚动到底部，第二次滚动就可以了。因为刷新了。
export default {
  name: 'wrapScroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return createBlock(
      Scroll,
      mergeProps({ ref: 'refScroll' }, ctx.$props, {
        onScroll: (e) => {
          ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => [renderSlot(ctx.$slots, 'default')])
      }
    )
  },
  setup() {
    const refScroll = ref(null)
    // 利用computed做一个延迟
    const scroll = computed(() => refScroll.value.scroll)

    const storeSongs = useStoreSongs()
    const playList = computed(() => storeSongs.playList)

    watch(playList, async () => {
      await nextTick()

      scroll.value.refresh()
    })

    return {
      refScroll,
      scroll
    }
  }
}
