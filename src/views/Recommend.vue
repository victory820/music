<template>
  <div>
    <div class="slider-wrapper">
      <div class="slider-content">
        <!-- 没有数据会报错 -->
        <slider v-if="sliders.length" :sliders="sliders"></slider>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

import Slider from '@/components/base/slider/Index.vue'

import { getRecommend } from '@/service/recommend'

export default defineComponent({
  name: 'recommend-page',
  components: {
    Slider
  },
  data () {
    return {
      sliders: []
    }
  },
  methods: {

  },
  async created () {
    const result = await getRecommend()
    console.log(result)
    this.sliders = result.sliders
  }
})
</script>
<style lang="less" scoped>
.slider-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 40%;
  overflow: hidden;

  .slider-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>