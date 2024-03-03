<template>
  <div class="header-box">
    <span class="icon"></span>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
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
      vertical-align: top;
      margin-right: 10px;
      margin-top: 6px;
      width:30px;
      height:32px;
      .bg-image('./logo');
      background-size: 30px 32px;
      background-repeat: no-repeat;
    }
    .text{
      display: inline-block;
      font-size: @font-size-large;
    }
  }
</style>