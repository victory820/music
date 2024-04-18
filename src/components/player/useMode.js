import { computed } from 'vue'

import { useStoreSongs } from '@/stores/songs'
import { PLAY_MODE } from '@/assets/js/const.js'

export default function useMode() {
  const storeSongs = useStoreSongs()
  const playMode = computed(() => storeSongs.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
        ? 'icon-random'
        : 'icon-loop'
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲循环'
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    storeSongs.changeMode(mode)
  }

  function removeSong(song) {
    let currentIndex = storeSongs.currentIndex
    const sqListTemp = storeSongs.sequenceList.slice()
    const pListTemp = storeSongs.playList.slice()
    const sqListIndex = sqListTemp.findIndex((item) => item.id === song.id)
    const pListIndex = storeSongs.playList.findIndex((item) => item.id === song.id)
    if (pListIndex < 0 || sqListIndex < 0) {
      return
    }
    if (sqListIndex < currentIndex || currentIndex === pListTemp.length - 1) {
      currentIndex--
    }
    sqListTemp.splice(sqListIndex, 1)
    pListTemp.splice(pListIndex, 1)
    console.log('currentIndex', currentIndex)
    storeSongs.setSequenceList(sqListTemp)
    storeSongs.setPlaylist(pListTemp)
    storeSongs.setCurrentIndex(currentIndex)
  }

  return {
    modeIcon,
    modeText,
    changeMode,
    removeSong
  }
}
