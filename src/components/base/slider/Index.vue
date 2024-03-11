<template>
  <div class="slider" ref="refSlide">

    <div class="slide-group">
      <div class="slide-page" v-for="item in props.sliders" :key="item.id">
        <a :href="item.link">
          <img :src="item.pic">
        </a>
      </div>
    </div>

    <div class="dots-wrapper">
      <span class="dot" v-for="(item, index) in props.sliders" :key="item.id"
        :class="{ 'active': currentPageIndex === index }"></span>
    </div>

  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useSlider } from '@/components/base/slider/use-slider'

const props = defineProps({
  sliders: {
    type: Array,
    default: () => []
  }
})

const refSlide = ref()

const { currentPageIndex } = useSlider(refSlide)

</script>
<script>
export default {
  name: 'slider-box'
}
</script>
<style lang="less" scoped>
.slider {
  min-height: 1px;
  font-size: 0;
  // 控制元素对触摸操作的响应方式，允许元素在Y轴方向上进行平移操作
  touch-action: pan-y;

  .slide-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slide-page {
      display: inline-block;
      // 对元素进行3d转换，更有效利用硬件加速提升动画性能
      transform: translate3d(0, 0, 0);
      // 控制元素在进行旋转时背面内容的可见性
      // hidden在旋转过程中背面不可见
      backface-visibility: hidden;

      a {
        display: block;
        width: 100%;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      transform: translateZ(1px);
      border-radius: 50%;
      background: @color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: @color-text-ll;
      }
    }
  }
}
</style>
