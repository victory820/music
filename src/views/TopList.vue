<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li class="item" v-for="item in rankList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.pic" width="100" height="100" alt="" />
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song, index) in item.songList" :key="song.id">
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }} - {{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop"></component>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Scroll from '@/components/wrapScroll/index'

import { TOP_KEY } from '@/assets/js/const'
import { setSession } from '@/assets/js/storage'

import { getTopList } from '@/service/topList'

const router = useRouter()

const rankList = ref([])
const loading = ref(false)
const selectedTop = ref(null)
const Component = ref('')

const selectItem = (item) => {
  setSession(TOP_KEY, item)
  selectedTop.value = item
  Component.value = 'top-detail-page'
  router.push({
    path: `/top-list/${item.id}`
  })
}

const getList = async () => {
  loading.value = true
  try {
    const { topList } = await getTopList()
    rankList.value = topList
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

onMounted(() => {
  getList()
})
</script>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'top-list-page'
})
</script>
<style lang="less" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: @color-highlight-background;
        color: @color-text-d;
        font-size: @font-size-small;
        .song {
          .no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
