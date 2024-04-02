<template>
  <scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="refScroll">
    <ul ref="refGroup">
      <li class="group-item" v-for="group in singerList" :key="group.title">
        <h2 class="group-title">{{ group.title }}</h2>
        <ul class="singer-list">
          <li
            class="singer-item"
            v-for="singer in group.list"
            :key="singer.id"
            @click="selectSong(singer)"
          >
            <img v-lazy="singer.pic" alt="" />
            <div class="singer-name">
              {{ singer.name }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed-box" v-show="groupTitle" :style="groupStyle">
      <div class="fixed-title">{{ groupTitle }}</div>
    </div>
    <div
      class="shortcut-list"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent="onShortcutTouchEnd"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :class="{ current: currentIndex === index }"
          :key="item"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script setup>
import Scroll from '@/components/base/scroll/Index.vue'

import useFixed from './useFixed'
import useShortcut from './useShortcut'

const props = defineProps({
  singerList: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['select'])

const { refGroup, onScroll, groupTitle, groupStyle, currentIndex } = useFixed(props)

const { shortcutList, refScroll, onShortcutTouchStart, onShortcutTouchMove, onShortcutTouchEnd } =
  useShortcut(props, refGroup)

function selectSong(singer) {
  emit('select', singer)
}
</script>

<style lang="less" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: @color-background;
  .group-item {
    padding-bottom: 30px;
    .group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
    .singer-list {
      .singer-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .singer-name {
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
  }

  .fixed-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
  }
  .shortcut-list {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: @color-background-d;
    li {
      padding: 3px;
      line-height: 1;
      text-align: center;
      font-size: @font-size-small;
      color: @color-text-l;
      &.current {
        color: @color-theme;
      }
    }
  }
}
</style>
