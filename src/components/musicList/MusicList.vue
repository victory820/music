<template>
  <div class="list-box">
    <div class="back">
      <i class-icon-back></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle">
      <div class="filter"></div>
    </div>
    <scroll class="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script setup>
import { computed } from 'vue'

import SongList from '@/components/base/songList/SongList.vue'
import Scroll from '@/components/base/scroll/Index.vue'

const props = defineProps({
  songs: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  pic: {
    type: String,
    default: ''
  }
})

const bgImageStyle = computed(() => {
  return {
    'background-image': `url(${props.pic})`
  }
})
</script>
<style lang="less">
.list-box {
  .back {
  }
  .title {
    text-align: center;
  }
  .bg-image {
    .filter {
    }
  }
  .list {
    .song-list-wrapper {
    }
  }
}
</style>
