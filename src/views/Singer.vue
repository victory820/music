<template>
  <div class="singer-box" v-loading="singerList.length === 0">
    <index-list :singerList="singerList"></index-list>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'

import IndexList from '@/components/base/indexList/IndexList.vue'

import { getSingerList } from '@/service/singers'

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
