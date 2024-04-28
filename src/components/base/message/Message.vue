<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  delay: {
    type: Number,
    default: 2000
  }
})

const visible = ref(false)
const timer = ref(null)

const hide = () => {
  clearTimeout(timer.value)
  visible.value = false
}

const show = () => {
  visible.value = true
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    hide()
  }, props.delay)
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: @color-dialog-background;
  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }
  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
