<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
  <!-- 这里Component必须大写，vue-router的规定 -->
  <router-view v-slot="{ Component }" name="user">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </transition>
  </router-view>
  <player></player>
</template>

<script setup>
import { computed } from 'vue'
import MHeader from '@/components/header/MHeader.vue'
import Tab from '@/components/tab/Tabs.vue'
import Player from '@/components/player/Index.vue'

import { useStoreSongs } from '@/stores/songs'

const storeSongs = useStoreSongs()

// const Component = ref('UserCenter')

const viewStyle = computed(() => {
  const bottom = storeSongs.playList.length ? '50px' : '0'
  return {
    bottom
  }
})
</script>
