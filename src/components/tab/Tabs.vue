<template>
  <div class="tab-box">
    <router-link :to="item.path" v-for="item in tabs" :key="item.path" class="tab-item">
      <span class="tab-link">{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'top-tabs',
  data () {
    return {
      tabs: [
        {
          title: '推荐',
          path: '/recommend'
        },
        {
          title: '歌手',
          path: '/singer'
        },
        {
          title: '排行',
          path: '/top-list'
        },
        {
          title: '搜索',
          path: '/search'
        }
      ]
    }
  }
})
</script>

<style lang="less" scoped>
.tab-box {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: @font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: @color-text-l;
    }

    // vue-router中定义的类名，可以通过此设置活动状态下路由链接样式
    &.router-link-active {
      .tab-link {
        color: @color-theme;
        border-bottom: 2px solid @color-theme;
      }
    }
  }

}
</style>