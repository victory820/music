<template>
  <div class="list-box">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div ref="refBgImg" class="bg-image" :style="bgImageStyle">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      v-loading="loading"
      v-no-result="isHasResult"
      :style="scrollStyle"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import SongList from '@/components/base/songList/SongList.vue'
import Scroll from '@/components/wrapScroll/index'

import { useStoreSongs } from '@/stores/songs'

const router = useRouter()

const storeSongs = useStoreSongs()

const RESERVE_HEIGHT = 40 // 这里是标题的高度

const props = defineProps({
  songs: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  pic: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const isHasResult = computed(() => {
  return !props.loading && props.songs.length === 0
})

const playBtnStyle = computed(() => {
  let display = ''
  if (scrollY.value > maxTranslateY.value) {
    display = 'none'
  }
  return { display }
})
const bgImageStyle = computed(() => {
  let zIndex = 0
  let paddingTop = '70%'
  let height = 0
  let translateZ = 0 // 为了兼容ios

  // 性能优化，在局部依赖收集时触发一次
  const tempScrollY = scrollY.value

  let scale = 1
  // 当向上滚动时，快都顶部时底下的背景图在最上显示，预留40px的高度
  if (tempScrollY > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = RESERVE_HEIGHT + 'px'
    translateZ = 1
  }
  if (tempScrollY < 0) {
    scale = 1 + Math.abs(tempScrollY / imgHeight.value)
  }
  return {
    transform: `scale(${scale}) translateZ(${translateZ})`,
    zIndex,
    paddingTop,
    height,
    'background-image': `url(${props.pic})`
  }
})

const filterStyle = computed(() => {
  let blurVal = 0
  const tempScrollY = scrollY.value
  const tempImgHeight = imgHeight.value

  if (tempScrollY >= 0) {
    blurVal = Math.min(maxTranslateY.value / tempImgHeight, tempScrollY / tempImgHeight) * 20
  }

  return {
    'backdrop-filter': `blur(${blurVal}px)`
  }
})

const scrollStyle = computed(() => {
  const bottom = storeSongs.playList.length ? '50px' : '0'
  return {
    top: `${imgHeight.value}px`,
    bottom
  }
})

const refBgImg = ref(null)
const imgHeight = ref(0)
const maxTranslateY = ref(0)
const scrollY = ref(0)

const random = () => {
  storeSongs.randomPlay(props.songs)
}

const selectItem = ({ index }) => {
  storeSongs.selectPlay({ list: props.songs, index })
}

const onScroll = (pos) => {
  scrollY.value = -pos.y
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  imgHeight.value = refBgImg.value.clientHeight
  maxTranslateY.value = imgHeight.value - RESERVE_HEIGHT
})
</script>
<style lang="less" scoped>
.list-box {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    i {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    .no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: @font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: @font-size-small;
        }
      }
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: @color-background;
    }
  }
}
</style>
