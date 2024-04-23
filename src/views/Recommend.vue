<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <!-- 没有数据会报错 -->
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>

        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>

          <ul>
            <li
              class="recommend-item"
              v-for="item in albums"
              :key="item.id"
              @click="clickItem(item)"
            >
              <div class="recommend-item-img">
                <img v-lazy="item.pic" alt="" />
              </div>
              <div class="recommend-item-info">
                <h2 class="recommend-item-name">{{ item.username }}</h2>
                <p class="recommend-item-title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <!-- 这里Component必须大写，vue-router的规定 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="albumInfo"></component>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
// import { defineComponent } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Slider from '@/components/base/slider/Index.vue'
import Scroll from '@/components/wrapScroll/index'

import { getRecommend } from '@/service/recommend'
import { ALBUM_KEY } from '@/assets/js/const'
import { setSession } from '@/assets/js/storage'

const router = useRouter()

const sliders = ref([])
const albums = ref([])

const loading = computed(() => {
  return !sliders.value.length && !albums.value.length
})

const init = async () => {
  try {
    const result = await getRecommend()
    sliders.value = result.sliders
    albums.value = result.albums
  } catch (error) {
    console.log(error)
  }
}

const Component = ref('')
const albumInfo = ref()
const clickItem = (album) => {
  albumInfo.value = album
  setSession(ALBUM_KEY, album)
  Component.value = 'album-page'
  router.push({
    path: `/recommend/${album.id}`
  })
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.recommend {
  // 为了做loading的居中
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: hidden;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: @font-size-medium-x;
        color: @color-theme;
      }
      .recommend-item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .recommend-item-img {
          width: 60px;
          // flex: 0 0 60px;
          padding-right: 20px;
          img {
            width: 100%;
          }
        }
        .recommend-item-info {
          flex: 1;
          // display: flex;
          // flex-direction: column;
          // justify-content: center;
          line-height: 20px;
          overflow: hidden;
          font-size: @font-size-medium;
          .recommend-item-name {
            margin-bottom: 10px;
            color: @color-text;
          }
          .recommend-item-title {
            color: @color-text-d;
          }
        }
      }
    }
  }
}
</style>
