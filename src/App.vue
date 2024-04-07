<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
  <player></player>
</template>

<script setup>
import MHeader from '@/components/header/MHeader.vue'
import Tab from '@/components/tab/Tabs.vue'
import Player from '@/components/player/Index.vue'
</script>
