<template>
  <div class="singer-detail">
    <music-list :songs="songs" :singer="singer"></music-list>
  </div>
</template>
<script setup>
import { ref } from 'vue'

import MusicList from '@/components/musicList/MusicList.vue'

import { getSingerDetail } from '@/service/singers'
import { processSongs } from '@/service/song'

const props = defineProps({
  singer: {
    type: Object,
    required: true
  }
})

const songs = ref([])

const getDetail = async () => {
  try {
    const result = await getSingerDetail({ mid: props.singer.mid })
    const songsWithUrl = await processSongs(result.songs)
    songs.value = songsWithUrl
    console.log('===', songs.value)
  } catch (error) {
    console.log(error)
  }
}

getDetail()
</script>
