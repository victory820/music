<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <div v-show="!query">
          <switches :items="['最近播放', '搜索历史']" v-model="currentIndex"></switches>
          <div class="list-wrapper">
            <scroll v-if="currentIndex === 0" class="list-scroll" ref="refScroll">
              <div class="list-inner">
                <song-list :songs="playHistory" @select="addSong"></song-list>
              </div>
            </scroll>
            <scroll v-if="currentIndex === 1" class="list-scroll" ref="refScroll">
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                ></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query" :show-singer="false" @selectSong="addSongBySuggest"></suggest>
        </div>
        <message ref="refMessage">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">歌曲已经添加到播放列表</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { ref, computed, nextTick, watch } from 'vue'

import SearchInput from '@/components/search/InputSearch.vue'
import Suggest from '@/components/search/Suggest.vue'
import Scroll from '@/components/base/scroll/Index.vue'
import SongList from '@/components/base/songList/SongList.vue'
import SearchList from '@/components/base/searchList/SearchList.vue'
import Switches from '@/components/base/switch/Switch.vue'
import Message from '@/components/base/message/Message.vue'

import useSearchHistory from '@/components/search/useSearchHistory'

import { useStoreSongs } from '@/stores/songs'

const storeSongs = useStoreSongs()
const { saveSearch } = useSearchHistory()

const refScroll = ref(null)
const refMessage = ref(null)

const visible = ref(false)
const query = ref('')
const currentIndex = ref(0)

const playHistory = computed(() => {
  return storeSongs.playHistory
})
const searchHistory = computed(() => {
  return storeSongs.searchHistory
})
watch(query, async () => {
  await nextTick()
  refreshScroll()
})

const addQuery = (s) => {
  query.value = s
}
const addSong = async ({ song }) => {
  storeSongs.addSong(song)
  await nextTick()
  refreshScroll()
  refMessage.value.show()
}
const addSongBySuggest = (song) => {
  storeSongs.addSong(song)
  saveSearch(query.value)
  refMessage.value.show()
}

const refreshScroll = () => {
  refScroll.value.scroll.refresh()
}
const show = async () => {
  visible.value = true
  await nextTick()
  refreshScroll()
}
const hide = () => {
  visible.value = false
}

defineExpose({
  show,
  hide
})
</script>

<style lang="less" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: @color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: @font-size-medium;
    color: @color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: @font-size-medium;
    color: @color-text;
  }
}
</style>
