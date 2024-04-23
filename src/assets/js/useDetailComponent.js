import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { processSongs } from '@/service/song'

import { getSession } from '@/assets/js/storage'

export default function useDetailComponent(props, key, fetch) {
  const route = useRoute()
  const router = useRouter()

  const title = computed(() => {
    const tempObj = dataComputed.value
    return tempObj && (tempObj.name || tempObj.title)
  })
  const pic = computed(() => {
    const tempObj = dataComputed.value
    return tempObj && tempObj.pic
  })
  const dataComputed = computed(() => {
    let result = null
    if (props.singer) {
      result = props.singer
    } else {
      const cache = getSession(key)
      if (cache && (cache.mid || cache.id + '') === route.params.id) {
        result = cache
      }
    }
    return result
  })

  const songs = ref([])

  const loading = ref(true)

  const getDetail = async () => {
    try {
      loading.value = true
      const result = await fetch(dataComputed.value)
      const songsWithUrl = await processSongs(result.songs)
      songs.value = songsWithUrl
      loading.value = false
    } catch (error) {
      loading.value = false
      console.log(error)
    }
  }

  onMounted(() => {
    // 从一级列表过来，或从缓存中可以获取（刷新当前页面）
    if (dataComputed.value) {
      getDetail()
    } else {
      // 获取不到返回列表页面
      const path = route.matched[0].path
      router.push(path)
    }
  })

  return {
    title,
    pic,
    loading,
    songs
  }
}
