<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" alt="" />
      </div>
      <div class="top">
        <div class="back" @click="setSmall">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i @click="togglePlayer" :class="playIcon"></i>
          </div>
          <div class="icon i-right">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 被动关闭播放器时候处理pause事件 -->
    <audio ref="refAudio" @pause="pause" @canplay="canplay"></audio>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStoreSongs } from '@/stores/songs'

const storeSongs = useStoreSongs()

const refAudio = ref(null)
const songReady = ref(false)

const isPlaying = computed(() => storeSongs.playing)
const fullScreen = computed(() => storeSongs.fullScreen)
const currentSong = computed(() => storeSongs.currentSong)
const playList = computed(() => storeSongs.playList)
const currentIndex = computed(() => storeSongs.currentIndex)

const playIcon = computed(() => {
  return isPlaying.value ? 'icon-pause' : 'icon-play'
})

watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return
  }
  if (!songReady.value) {
    // 歌曲没准备好就不播放
    return
  }
  const audioEl = refAudio.value
  audioEl.src = newSong.url
  audioEl.play()
})

watch(isPlaying, (newState) => {
  if (!songReady.value) {
    // 没准备好就不播放
    return
  }
  const audioEl = refAudio.value
  if (newState) {
    audioEl.play()
  } else {
    audioEl.pause()
  }
})

const canplay = () => {
  if (songReady.value) {
    // 已经准备好了就不需要改变值
    return
  }
  songReady.value = true
}

function loop() {
  const audioEl = refAudio.value
  audioEl.currentTime = 0
  audioEl.play()
}
const prev = () => {
  const tempPlayList = playList.value
  if (!tempPlayList || tempPlayList.length === 0) {
    // 没有数据时
    return
  }

  if (tempPlayList.length === 1) {
    // 只有一个数据时
    // 从这首歌的开头播放
    loop()
  } else {
    // 有多个数据时
    let index = currentIndex.value - 1
    if (index === -1) {
      // 如第一个，返回到队尾，循环播放
      index = tempPlayList.length - 1
    }
    storeSongs.setCurrentIndex(index)
    if (!isPlaying.value) {
      storeSongs.setPlayingState(true)
    }
  }
}
const next = () => {
  const tempPlayList = playList.value
  if (!tempPlayList || tempPlayList.length === 0) {
    // 没有数据时
    return
  }

  if (tempPlayList.length === 1) {
    // 只有一个数据时
    // 从这首歌的开头播放
    loop()
  } else {
    // 有多个数据时
    let index = currentIndex.value + 1
    if (index === tempPlayList.length) {
      // 在最后一个，返回到队首，循环播放
      index = 0
    }
    storeSongs.setCurrentIndex(index)
    if (!isPlaying.value) {
      storeSongs.setPlayingState(true)
    }
  }
}
const pause = () => {
  // 被动关闭时，暂停播放
  storeSongs.setPlayingState(false)
}
const togglePlayer = () => {
  storeSongs.setPlayingState(!isPlaying.value)
}
const setSmall = () => {
  storeSongs.setFullScreen(false)
}
</script>

<style lang="less" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: @font-size-large-x;
        color: @color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        .no-wrap();
        font-size: @font-size-large;
        color: @color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
      }
      .progress-wrapper {
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: @color-theme;
          &.disable {
            color: @color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: @color-sub-theme;
        }
      }
    }
  }
}
</style>
