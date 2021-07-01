<template>
  <div>
    <m-header></m-header>
    <tab></tab>
    <router-view :style="viewStyle" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <router-view
      name="user"
      :style="viewStyle"
      v-slot="{ Component }">
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
    <player></player>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle () {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playlist'
    ])
  }
}
</script>
