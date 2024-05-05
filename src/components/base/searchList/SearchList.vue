<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item" :key="item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)" v-if="showDelete">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
defineProps({
  searches: {
    type: Array,
    default: () => []
  },
  showDelete: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['select', 'delete'])
const selectItem = (item) => {
  emits('select', item)
}
const deleteItem = (item) => {
  emits('delete', item)
}
</script>

<style lang="less" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: @color-text-l;
    }
    .icon {
      .extend-click();
      .icon-delete {
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
  }
}
</style>
