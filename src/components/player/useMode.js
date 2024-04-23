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

  return {
    modeIcon,
    modeText,
    changeMode
  }
}
