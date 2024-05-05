<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
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
        <div
          class="middle"
          @touchstart="onMiddleTouchStart"
          @touchmove="onMiddleTouchMove"
          @touchend="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="refCDWrapper">
              <div class="cd" ref="refCD">
                <img :class="cdCls" ref="refCDImage" class="image" :src="currentSong.pic" alt="" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" :style="middleRStyle" ref="refLyricScroll">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="refLyricList">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="refProgressBar"
                :progress="progress"
                @progressChanging="onProgressChanging"
                @progressChanged="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlayer" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player :progress="progress" :toggle-play="togglePlayer"></mini-player>
    <!-- 被动关闭播放器时候处理pause事件 -->
    <audio
      ref="refAudio"
      @pause="pause"
      @canplay="canplay"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick } from 'vue'

import ProgressBar from './ProgressBar.vue'
import Scroll from '@/components/base/scroll/Index.vue'
import MiniPlayer from '@/components/player/MiniPlayer.vue'

import { useStoreSongs } from '@/stores/songs'
import usePlayHistory from '@/components/player/usePlayHistory'
import useMode from './useMode'
import useFavorite from './useFavorite'
import useCD from './useCD'
import useLyrics from './useLyric'
import useMiddleInteractive from './useMiddleInteractive'
import useAnimation from './useAnimation'

import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/const.js'

const refAudio = ref(null)

const songReady = ref(false)
const currentTime = ref(0)
// const progressChanging = ref(false)

const storeSongs = useStoreSongs()
const { modeIcon, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()
const { cdCls, refCD, refCDImage } = useCD()
const {
  currentLyric,
  currentLineNum,
  playLyric,
  stopLyric,
  refLyricScroll,
  refLyricList,
  pureMusicLyric,
  playingLyric
} = useLyrics({
  songReady,
  currentTime
})
const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd
} = useMiddleInteractive()
const { refCDWrapper, enter, afterEnter, leave, afterLeave } = useAnimation(refCD)
const { savePlay } = usePlayHistory()

const isPlaying = computed(() => storeSongs.playing)
const fullScreen = computed(() => storeSongs.fullScreen)
const currentSong = computed(() => storeSongs.currentSong)
const playList = computed(() => storeSongs.playList)
const currentIndex = computed(() => storeSongs.currentIndex)

const playIcon = computed(() => {
  return isPlaying.value ? 'icon-pause' : 'icon-play'
})
const disableCls = computed(() => {
  return !songReady.value ? 'disable' : ''
})
const progress = computed(() => {
  return currentTime.value / currentSong.value.duration
})
const playMode = computed(() => storeSongs.playMode)

watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return
  }
  // 切换歌曲时需要播放时间归0
  currentTime.value = 0
  // 更换歌曲时重置准备状态
  songReady.value = false
  const audioEl = refAudio.value
  audioEl.src = newSong.url
  audioEl.play()
  storeSongs.setPlayingState(true)
})

watch(isPlaying, (newState) => {
  if (!songReady.value) {
    // 没准备好就不播放
    return
  }
  const audioEl = refAudio.value
  if (newState) {
    audioEl.play()
    playLyric()
  } else {
    audioEl.pause()
    stopLyric()
  }
})

const refProgressBar = ref(null)
watch(fullScreen, async (newFullScreen) => {
  if (newFullScreen) {
    await nextTick()
    refProgressBar.value.setOffset(progress.value)
  }
})

const onProgressChanging = (progress) => {
  // progressChanging.value = true
  // currentTime.value = currentSong.value.duration * progress
  refAudio.value.currentTime = currentSong.value.duration * progress
  // 先播放再暂停
  playLyric()
  stopLyric()
}
const onProgressChanged = (progress) => {
  // progressChanging.value = false
  refAudio.value.currentTime = currentTime.value = currentSong.value.duration * progress
  // 非播放状态，拖动完毕播放
  if (!isPlaying.value) {
    storeSongs.setPlayingState(true)
  }
  playLyric()
}

const end = () => {
  // 播放完毕，根据模式不同，进行播放
  currentTime.value = 0
  if (playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    next()
  }
}
const updateTime = (e) => {
  // if (!progressChanging.value) {
  //   const time = e.target.currentTime
  //   currentTime.value = time
  // }
  const time = e.target.currentTime
  currentTime.value = time
}

const error = () => {
  // 出错时可以切换歌曲
  songReady.value = true
}
const canplay = () => {
  if (songReady.value) {
    // 已经准备好了就不需要改变值
    return
  }
  songReady.value = true
  // 因为歌曲准备好，和获取歌词都是异步，所以保证两边都触发下播放歌词
  playLyric()
  savePlay(currentSong.value)
}

function loop() {
  const audioEl = refAudio.value
  audioEl.currentTime = 0
  audioEl.play()
  if (!isPlaying.value) {
    storeSongs.setPlayingState(true)
  }
}
const prev = () => {
  const tempPlayList = playList.value
  if (!songReady.value || !tempPlayList || tempPlayList.length === 0) {
    // 歌曲没有准备好或没有数据时
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
  }
}
const next = () => {
  const tempPlayList = playList.value
  if (!songReady.value || !tempPlayList || tempPlayList.length === 0) {
    // 歌曲没有准备好或没有数据时
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
  }
}
const pause = () => {
  // 被动关闭时，暂停播放
  storeSongs.setPlayingState(false)
}
const togglePlayer = () => {
  if (!songReady.value) {
    return
  }
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current {
              color: @color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @color-text;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: @color-text;
          font-size: @font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
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
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
