<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle"></router-view>
  <player></player>
</template>

<script setup>
import { computed } from 'vue'
import MHeader from '@/components/header/MHeader.vue'
import Tab from '@/components/tab/Tabs.vue'
import Player from '@/components/player/Index.vue'

import { useStoreSongs } from '@/stores/songs'

const storeSongs = useStoreSongs()

const viewStyle = computed(() => {
  const bottom = storeSongs.playList.length ? '50px' : '0'
  return {
    bottom
  }
})
</script>
