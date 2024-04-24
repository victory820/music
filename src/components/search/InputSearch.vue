<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input type="text" class="input-inner" v-model="query" :placeholder="placeholder" />
    <i class="icon-dismiss" @click="delQuery" v-show="query"></i>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

import { debounce } from 'throttle-debounce'

const model = defineModel()
defineProps({
  placeholder: {
    type: String,
    default: '搜索歌曲、歌手'
  }
})

const query = ref()

watch(
  query,
  debounce(300, (newQuery) => {
    // 监测本input框的输入
    model.value = newQuery
  })
)
watch(model, (newVal) => {
  // 监测外面修改里面
  query.value = newVal
})

const delQuery = () => {
  query.value = ''
}
</script>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'searchInput'
})
</script>
<style lang="less" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: @color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: @color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: @color-highlight-background;
    color: @color-text;
    font-size: @font-size-medium;
    outline: 0;
    &::placeholder {
      color: @color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: @color-text-d;
  }
}
</style>
