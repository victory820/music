<template>
  <scroll class="index-list">
    <ul>
      <li class="group-item" v-for="group in singerList" :key="group.title">
        <h2 class="group-title">{{ group.title }}</h2>
        <ul class="singer-list">
          <li class="singer-item" v-for="singer in group.list" :key="singer.id">
            <img v-lazy="singer.pic" alt="" />
            <div class="singer-name">
              {{ singer.name }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>
<script setup>
import Scroll from '@/components/base/scroll/Index.vue'

const props = defineProps({
  singerList: {
    type: Array,
    default: () => []
  }
})
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
}
</style>
