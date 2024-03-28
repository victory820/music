<template>
  <div class="loading-box">
    <div class="loading-content">
      <img src="./loading.gif" />
      <p class="desc">{{ text }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref, defineExpose } from 'vue'

const text = ref('正在载入...')

const setText = (str) => {
  text.value = str
}

// defineExpose({
//   setText
// })
</script>
<style lang="less" scoped>
.loading-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    img {
      width: 24px;
      height: 24px;
    }
    .desc {
      line-height: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
}
</style>
