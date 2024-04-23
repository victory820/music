<template>
  <div class="singer-detail">
    <music-list
      :showRank="true"
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>
<script setup>
import MusicList from '@/components/musicList/MusicList.vue'

import { TOP_KEY } from '@/assets/js/const'
import { getTopDetail } from '@/service/topList'

import useDetailComponent from '@/assets/js/useDetailComponent'

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {}
    }
  }
})

const { title, pic, loading, songs } = useDetailComponent(props, TOP_KEY, getTopDetail)
</script>
<style lang="less" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: @color-background;
}
</style>
