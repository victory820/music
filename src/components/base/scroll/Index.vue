<template>
  <div ref="refRoot">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useScroll from './useScroll'

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  },
  probeType: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['scroll'])

const refRoot = ref(null)

const scroll = useScroll(refRoot, props, emit)
// 将实例返回出去
defineExpose({
  scroll
})
</script>
./useScroll
