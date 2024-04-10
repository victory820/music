import { computed } from 'vue'
import { useStoreSongs } from '@/stores/songs'

export default function useFavorite() {
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
    if (isFavorite(song)) {
      storeSongs.deleteFavoriteList(song)
    } else {
      storeSongs.saveFavoriteList(song)
    }
  }
  function isFavorite(song) {
    return (
      favoriteList.value.findIndex((item) => {
        return item.id === song.id
      }) > -1
    )
  }

  return {
    getFavoriteIcon
  }
}
