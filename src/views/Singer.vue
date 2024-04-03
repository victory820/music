<template>
  <div class="singer-box" v-loading="singerList.length === 0">
    <index-list :singerList="singerList" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="singerInfo"></component>
        <!-- <singer-detail :singer="singerInfo"></singer-detail> -->
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import IndexList from '@/components/base/indexList/IndexList.vue'
// import SingerDetail from './SingerDetail.vue'

import { getSingerList } from '@/service/singers'

import { SINGER_KEY } from '@/assets/js/const'
import { setSession } from '@/assets/js/storage'

const router = useRouter()

const Component = ref('')

const singerInfo = ref(null)
const selectSinger = (singer) => {
  singerInfo.value = singer
  setSession(SINGER_KEY, singer)
  Component.value = 'singer-detail'
  router.push({
    path: `/singer/${singer.mid}`
  })
}

const singerList = ref([])
const getList = async () => {
  try {
    const { singers } = await getSingerList()
    singerList.value = singers
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  // component.value = 'singer-detail'
  getList()
})
</script>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'singer-page'
})
</script>
<style lang="less" scoped>
.singer-box {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: hidden;
}
</style>
