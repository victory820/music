import { useStoreSongs } from '@/stores/songs'
import { save, remove, clearLocal } from '@/assets/js/arrayStore.js'
import { SEARCH_KEY } from '@/assets/js/const'

export default function useSearchHistory() {
  const storeSongs = useStoreSongs()

  const maxLen = 200

  function saveSearch(query) {
    const searches = save(
      query,
      SEARCH_KEY,
      (item) => {
        return item === query
      },
      maxLen
    )
    storeSongs.setSearchHistory(searches)
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    storeSongs.setSearchHistory(searches)
  }

  function clearSearch() {
    const searches = clearLocal(SEARCH_KEY)
    storeSongs.setSearchHistory(searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
