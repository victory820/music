<template>
  <ul class="song-list">
    <li class="item" v-for="song in songs" :key="song.id">
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>
<script setup>
const props = defineProps({
  songs: {
    type: Array,
    required: true
  }
})

const getDesc = (song) => {
  return `${song.singer}·${song.album}`
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
