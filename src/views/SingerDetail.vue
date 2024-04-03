<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MusicList from '@/components/musicList/MusicList.vue'

import { getSingerDetail } from '@/service/singers'
import { processSongs } from '@/service/song'

import { SINGER_KEY } from '@/assets/js/const'
import { getSession } from '@/assets/js/storage'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  singer: {
    type: Object,
    default() {
      return {}
    }
  }
})

const title = computed(() => {
  const tempSinger = singerComputed.value
  return tempSinger && tempSinger.name
})
const pic = computed(() => {
  const tempSinger = singerComputed.value
  return tempSinger && tempSinger.pic
})
const singerComputed = computed(() => {
  let result = null
  if (props.singer) {
    result = props.singer
  } else {
    const cacheSinger = getSession(SINGER_KEY)
    if (cacheSinger && cacheSinger.mid === route.params.id) {
      result = cacheSinger
    }
  }
  return result
})

const songs = ref([])

const loading = ref(true)

const getDetail = async () => {
  try {
    loading.value = true
    const result = await getSingerDetail({ mid: singerComputed.value.mid })
    const songsWithUrl = await processSongs(result.songs)
    songs.value = songsWithUrl
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

onMounted(() => {
  if (singerComputed.value) {
    getDetail()
  } else {
    const path = route.matched[0].path
    router.push(path)
  }
})
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
