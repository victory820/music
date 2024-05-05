import { useStoreSongs } from '@/stores/songs'
import { save } from '@/assets/js/arrayStore.js'
import { PLAY_KEY } from '@/assets/js/const.js'

export default function usePlayHistory() {
  const storeSongs = useStoreSongs()

  const MAX_LEN = 200

  function savePlay(song) {
    const songs = save(
      song,
      PLAY_KEY,
      (item) => {
        return item.id === song.id
      },
      MAX_LEN
    )

    storeSongs.setPlayHistory(songs)
  }

  return {
    savePlay
  }
}
