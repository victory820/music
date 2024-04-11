<template>
  <div class="progress-bar" ref="refProgressBar" @click="clickBar">
    <div class="bar-inner">
      <div class="progress" ref="refProgress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="progressBtnStyle"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend.prevent="touchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const PROGRESS_BAR_WIDTH = 16

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['progressChanging', 'progressChanged'])

const refProgressBar = ref(null)
const refProgress = ref(null)

const offset = ref(0)
// 不需要触发页面渲染，所以不需要响应式
const touch = {
  x1: 0,
  beginWidth: 0
}

const progressStyle = computed(() => {
  return { width: offset.value + 'px' }
})
const progressBtnStyle = computed(() => {
  return `transform: translate3d(${offset.value}px, 0, 0)`
})
watch(
  () => props.progress,
  (newProgress) => {
    const barWidth = refProgressBar.value.clientWidth - PROGRESS_BAR_WIDTH
    offset.value = barWidth * newProgress
  }
)

const touchStart = (e) => {
  // 起点位置
  touch.x1 = e.touches[0].pageX
  touch.beginWidth = refProgress.value.clientWidth
}
const touchMove = (e) => {
  // 移动长度
  const delta = e.touches[0].pageX - touch.x1
  // 移动到的目标位置
  const tempWidth = touch.beginWidth + delta
  // 整条bar可以移动的最大长度
  const barWidth = refProgressBar.value.clientWidth - PROGRESS_BAR_WIDTH
  // 这里限制了最低和最高，不会超出边界
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
  offset.value = barWidth * progress
  emits('progressChanging', progress)
}
const touchEnd = () => {
  const barWidth = refProgressBar.value.clientWidth - PROGRESS_BAR_WIDTH
  const progress = refProgress.value.clientWidth / barWidth
  emits('progressChanged', progress)
}
const clickBar = (e) => {
  const rect = refProgressBar.value.getBoundingClientRect()
  const offsetWidth = e.pageX - rect.left
  const barWidth = refProgressBar.value.clientWidth - PROGRESS_BAR_WIDTH
  const progress = offsetWidth / barWidth
  emits('progressChanged', progress)
}
</script>

<style lang="less" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>
