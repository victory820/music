<template>
  <div class="no-result">
    <div class="no-result-content">
      <div class="icon"></div>
      <div class="text">{{ title }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const title = ref('暂无数据')

const setText = (val) => {
  title.value = val
}

defineExpose({
  setText
})
</script>

<script>
export default {
  name: 'no-result'
}
</script>
<style lang="less" scoped>
.no-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .no-result-content {
    text-align: center;
    .icon {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      background-image: url(@/assets/images/no-result.png);
      background-size: 40px 40px;
    }
    .text {
      margin-top: 30px;
      font-size: @font-size-medium;
      color: @color-text-d;
    }
  }
}
</style>
