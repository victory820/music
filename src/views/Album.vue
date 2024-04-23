<template>
  <div class="album">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>
<script setup>
import MusicList from '@/components/musicList/MusicList.vue'

import { ALBUM_KEY } from '@/assets/js/const'
import { getAlbum } from '@/service/recommend'

import useDetailComponent from '@/assets/js/useDetailComponent'

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {}
    }
  }
})

const { title, pic, loading, songs } = useDetailComponent(props, ALBUM_KEY, getAlbum)
</script>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'albumPage'
})
</script>
<style lang="less" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: @color-background;
}
</style>
