<template>
  <div class="singer-detail"></div>
</template>
<script setup>
import { getSingerDetail } from '@/service/singers'
import { processSongs } from '@/service/song'

const props = defineProps({
  singer: {
    type: Object,
    required: true
  }
})

const getDetail = async () => {
  try {
    const result = await getSingerDetail({ mid: props.singer.mid })
    const songsUrl = await processSongs(result.songs)
    console.log('==2==', songsUrl)
  } catch (error) {
    console.log(error)
  }
}

// onMounted(() => {
// getDetail()
// })
getDetail()
</script>
