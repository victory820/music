<template>
  <ul class="song-list">
    <li class="item" v-for="(song, index) in songs" :key="song.id" @click="selectItem(song, index)">
      <div class="rank" v-if="showRank">
        <span :class="getRankCls(index)">
          {{ getRankText(index) }}
        </span>
      </div>
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>
<script setup>
defineProps({
  songs: {
    type: Array,
    required: true
  },
  showRank: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['select'])

const getDesc = (song) => {
  return `${song.singer}·${song.album}`
}
const selectItem = (song, index) => {
  emit('select', { song, index })
}

const getRankCls = (index) => {
  if (index <= 2) {
    return `icon icon${index}`
  } else {
    return 'text'
  }
}
const getRankText = (index) => {
  if (index > 2) {
    return index + 1
  }
}
</script>
<style lang="less" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: @font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          .bg-image('first');
        }
        &.icon1 {
          .bg-image('second');
        }
        &.icon2 {
          .bg-image('third');
        }
      }
      .text {
        color: @color-theme;
        font-size: @font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        color: @color-text;
        .no-wrap();
      }
      .desc {
        margin-top: 4px;
        color: @color-text-d;
        .no-wrap();
      }
    }
  }
}
</style>
