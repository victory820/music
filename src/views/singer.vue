<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>
<script>
import storage from 'good-storage'
import IndexList from '@/components/index-list/index-list'
import { getSingerList } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singers',
  components: {
    IndexList
  },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created () {
    const { singers } = await getSingerList()
    this.singers = singers
  },
  methods: {
    selectSinger (singer) {
      this.selectedSinger = singer
      // 将歌手数据缓存到本地，刷新时使用
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>
<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 0;
  }
</style>
