<template>
  <div
    ref="refRoot"
    class="suggest"
    v-loading:[loadingText]="isLoading"
    v-no-result:[loadingResult]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }} - {{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullupLoading"></div>
    </ul>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { getSearch } from '@/service/search'
import { processSongs } from '@/service/song'

import usePullUp from '@/components/search/usePullUp'

const { refRoot, isLoadPull } = usePullUp(searchMore)

const props = defineProps({
  query: {
    type: String,
    default: ''
  },
  showSinger: {
    type: Boolean,
    default: true
  }
})

const singer = ref(null)
const songs = ref([])
const hasMore = ref(true)
const page = ref(1)

const loadingText = ref('')
const loadingResult = ref('抱歉，暂无搜索结果')

const isLoading = computed(() => {
  return !songs.value.length && !singer.value && hasMore.value
})
const noResult = computed(() => {
  return !songs.value.length && !singer.value && !hasMore.value
})
const pullupLoading = computed(() => {
  return isLoadPull.value && hasMore.value
})

// 必须watch响应式对象。如果只用props.query这里只是普通字符串
watch(
  () => props.query,
  async (newQuery) => {
    if (!newQuery) {
      return
    }
    await queryFirst()
  }
)

const queryFirst = async () => {
  try {
    if (!props.query) {
      return
    }
    singer.value = null
    songs.value = []
    hasMore.value = true
    page.value = 1

    const result = await getSearch(props.query, page.value, props.showSinger)
    songs.value = await processSongs(result.songs)

    hasMore.value = result.hasMore
    singer.value = result.singer
  } catch (error) {
    console.log(error)
  }
}
async function searchMore() {
  console.log('---', hasMore.value)
  if (!hasMore.value || !props.query) {
    return
  }
  try {
    page.value++

    const result = await getSearch(props.query, page.value, props.showSinger)
    songs.value = songs.value.concat(await processSongs(result.songs))

    hasMore.value = result.hasMore
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="less" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text {
          .no-wrap();
        }
      }
    }
  }
}
</style>
