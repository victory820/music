<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="refScroll" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="selectedKey(item)">
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>

        <div class="search-history" v-show="searchHistoryList.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="refConfirm"
            text="是否清空所有搜索历史？"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></confirm>
          <search-list
            :searches="searchHistoryList"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest :query="query" @selectSong="selectedSong" @selectSinger="selectedSinger"></suggest>
    </div>
    <!-- 这里Component必须大写，vue-router的规定 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="singerInfo"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import SearchInput from '@/components/search/InputSearch.vue'
import Suggest from '@/components/search/Suggest.vue'
import SearchList from '@/components/base/searchList/SearchList.vue'
import Scroll from '@/components/wrapScroll/index'
import Confirm from '@/components/base/confirm/Index.vue'

import { getHotKeys } from '@/service/search'
import { useStoreSongs } from '@/stores/songs'
import { SINGER_KEY } from '@/assets/js/const'
import { setSession } from '@/assets/js/storage'
import useSearchHistory from '@/components/search/useSearchHistory'

const router = useRouter()
const storeSongs = useStoreSongs()
const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

const refScroll = ref(null)
const refConfirm = ref(null)

const query = ref('')
const singerInfo = ref()
const Component = ref('')

const hotKeys = ref([])

const searchHistoryList = computed(() => {
  return storeSongs.searchHistory
})

watch(query, async (newQuery) => {
  if (!newQuery) {
    await nextTick()
    refreshScroll()
  }
})

function refreshScroll() {
  refScroll.value.scroll.refresh()
}

const getKeys = async () => {
  try {
    const result = await getHotKeys()
    hotKeys.value = result.hotKeys
  } catch (error) {
    console.log(error)
  }
}

const selectedKey = ({ key }) => {
  // query.value = key
  addQuery(key)
}

const selectedSong = (song) => {
  saveSearch(query.value)
  storeSongs.addSong(song)
}
const selectedSinger = (singer) => {
  saveSearch(query.value)
  singerInfo.value = singer
  setSession(SINGER_KEY, singer)
  Component.value = 'singer-detail'
  router.push(`/search/${singer.mid}`)
}

const addQuery = (s) => {
  query.value = s
}

const showConfirm = () => {
  refConfirm.value.show()
}

onMounted(() => {
  getKeys()
})
</script>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'search-page'
})
</script>
<style lang="less" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: @font-size-medium;
        color: @color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: @color-highlight-background;
        font-size: @font-size-medium;
        color: @color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: @font-size-medium;
        color: @color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          .extend-click();
          .icon-clear {
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
