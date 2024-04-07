<template>
  <div class="header-box">
    <span class="icon"></span>
    <h1 class="text">Music</h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MHeader'
})
</script>

<style lang="less" scoped>
.header-box {
  height: 44px;
  line-height: 44px;
  text-align: center;
  color: @color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    width: 26px;
    height: 36px;
    background-image: url(@/assets/images/logo.png);
    background-size: 26px 26px;
    background-repeat: no-repeat;
  }
  .text {
    display: inline-block;
    font-size: @font-size-large;
  }
}
</style>
