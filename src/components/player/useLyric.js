import { ref, computed, watch } from 'vue'
import Lyric from 'lyric-parser'

import { useStoreSongs } from '@/stores/songs'
import { getLyric } from '@/service/song'
export default function useLyrics({ songReady, currentTime }) {
  const storeSongs = useStoreSongs()

  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const refLyricScroll = ref(null)
  const refLyricList = ref(null)

  const currentSong = computed(() => storeSongs.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.id || !newSong.url) return

    const lyric = await getLyric(newSong)
    storeSongs.addSongLyric({ song: newSong, lyric })

    // 切换歌曲时，上次返回不在使用
    if (currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)
    if (songReady.value) {
      playLyric()
    }
  })

  function playLyric() {
    currentLyric.value && currentLyric.value.seek(currentTime.value * 1000)
  }
  function stopLyric() {
    currentLyric.value && currentLyric.value.stop()
  }

  function handleLyric({ lineNum }) {
    currentLineNum.value = lineNum
    const lyricScroll = refLyricScroll.value
    const lyricList = refLyricList.value
    const lyricListChildren = lyricList.children

    const delta = 5
    if (lineNum > delta) {
      // 超过5行后，滚动。这样高亮就始终在中间
      lyricScroll.scroll.scrollToElement(lyricListChildren[lineNum - delta], 1000)
    } else {
      // 前五行，不滚动
      lyricScroll.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    refLyricScroll,
    refLyricList,
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric
  }
}
