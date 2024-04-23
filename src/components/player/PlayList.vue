<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll ref="refScroll" class="list-content">
            <transition-group ref="refList" name="list" tag="ul">
              <li
                v-for="song in sequenceList"
                :key="song.id"
                class="item"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" @click.stop="delSong(song)" :class="{ disable: removing }">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="refConfirm"
          text="是否清空播放列表？"
          cancelBtnText="清空"
          @confirm="clearAllSongs"
        ></confirm>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { ref, computed, nextTick, watch } from 'vue'

import Scroll from '@/components/base/scroll/Index.vue'
import Confirm from '@/components/base/confirm/Index.vue'

import { useStoreSongs } from '@/stores/songs'
import useMode from './useMode'
import useFavorite from './useFavorite'

const storeSongs = useStoreSongs()
const { modeIcon, modeText, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

const refScroll = ref(null)
const refList = ref(null)
const refConfirm = ref(null)

const visible = ref(false)
const removing = ref(false)

const playlist = computed(() => storeSongs.playList)
const sequenceList = computed(() => storeSongs.sequenceList)
const currentSong = computed(() => storeSongs.currentSong)

watch(currentSong, async (newSong) => {
  if (!visible.value || !newSong.id) {
    return
  }
  // 删除等更改时需要等待
  await nextTick()
  goToCurrent()
})

const show = async () => {
  visible.value = true
  await nextTick()
  refreshScroll()
  console.log('展示')
  goToCurrent()
}
const hide = () => {
  visible.value = false
}
const getCurrentIon = (song) => {
  if (song.id === currentSong.value.id) {
    return 'icon-play'
  } else {
    return ''
  }
}
const refreshScroll = () => {
  refScroll.value.scroll.refresh()
}

const goToCurrent = () => {
  const index = sequenceList.value.findIndex((item) => item.id === currentSong.value.id)
  if (index === -1) {
    return
  }
  const targetEl = refList.value.$el.children[index]
  refScroll.value.scroll.scrollToElement(targetEl, 300)
}

const selectItem = (song) => {
  const index = playlist.value.findIndex((item) => item.id === song.id)
  if (index === -1) {
    return
  }
  storeSongs.setCurrentIndex(index)
  storeSongs.setPlayingState(true)
}
const delSong = (song) => {
  // 频繁操作删除时候dom可能不存在
  if (removing.value) {
    return
  }
  removing.value = true
  storeSongs.removeSong(song)
  if (!playlist.value.length) {
    hide()
  }
  setTimeout(() => {
    // 因为动画是300ms
    removing.value = false
  }, 300)
}
const showConfirm = () => {
  refConfirm.value.show()
}
const clearAllSongs = () => {
  storeSongs.clearSongsList()
  hide()
}

defineExpose({ show, hide })
</script>
<style lang="less" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: @color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: @color-theme-d;
        }
        .text {
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-l;
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

    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: @font-size-small;
          color: @color-theme-d;
        }
        .text {
          flex: 1;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text-d;
        }
        .favorite {
          .extend-click();
          margin-right: 15px;
          font-size: @font-size-small;
          color: @color-theme;
          .icon-favorite {
            color: @color-sub-theme;
          }
        }
        .delete {
          .extend-click();
          font-size: @font-size-small;
          color: @color-theme;
          &.disable {
            color: @color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid @color-text-l;
        border-radius: 100px;
        color: @color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: @font-size-small-s;
        }
        .text {
          font-size: @font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: @color-background;
      font-size: @font-size-medium-x;
      color: @color-text-l;
    }
  }
}
</style>
