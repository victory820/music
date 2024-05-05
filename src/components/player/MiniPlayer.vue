<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="refCD" class="cd">
          <img
            ref="refCDImage"
            width="40"
            height="40"
            alt=""
            :class="cdCls"
            :src="currentSong.pic"
          />
        </div>
      </div>

      <div ref="refSliderWrapper" class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playlist" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <h2 class="desc">{{ song.singer }}</h2>
          </div>
        </div>
      </div>

      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="props.togglePlay"></i>
        </progress-circle>
      </div>

      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>

      <play-list ref="refPlayList"></play-list>
    </div>
  </transition>
</template>
<script setup>
import { ref, computed } from 'vue'

import ProgressCircle from '@/components/player/ProgressCircle.vue'
import PlayList from '@/components/player/PlayList.vue'

import { useStoreSongs } from '@/stores/songs'
import useCD from './useCD'
import useMiniSlider from './useMiniSlider'

const storeSongs = useStoreSongs()

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  togglePlay: Function
})

const { cdCls, refCD, refCDImage } = useCD()
const { refSliderWrapper } = useMiniSlider()

const refPlayList = ref(null)

const fullScreen = computed(() => storeSongs.fullScreen)
const currentSong = computed(() => storeSongs.currentSong)
const playing = computed(() => storeSongs.playing)
const miniPlayIcon = computed(() => (playing.value ? 'icon-pause-mini' : 'icon-play-mini'))
const playlist = computed(() => storeSongs.playList)

const showNormalPlayer = () => {
  storeSongs.setFullScreen(true)
}

const showPlaylist = () => {
  refPlayList.value.show()
}
</script>
<style lang="less" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: @color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text;
        }
        .desc {
          .no-wrap();
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: @color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: @color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
