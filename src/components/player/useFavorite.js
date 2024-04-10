import { computed } from 'vue'
import { useStoreSongs } from '@/stores/songs'
import { FAVORITE_KEY } from '@/assets/js/const'
import { save, remove } from '@/assets/js/arrayStore'
export default function useFavorite() {
  const maxLen = 100
  const storeSongs = useStoreSongs()

  const favoriteList = computed(() => storeSongs.favoriteList)

  function getFavoriteIcon(song) {
    if (isFavorite(song)) {
      return 'icon-favorite'
    } else {
      return 'icon-not-favorite'
    }
  }

  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      // maxLen超过100条就把第一位移除。
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    storeSongs.setFavoriteList(list)

    function compare(item) {
      return item.id === song.id
    }
  }
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => item.id === song.id) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
