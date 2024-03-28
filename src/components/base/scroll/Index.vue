<template>
  <div ref="refRoot">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import useScroll from './use-scroll'

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  }
})

const refRoot = ref(null)
useScroll(refRoot, props)
</script>
