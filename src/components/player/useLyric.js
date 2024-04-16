import { ref, computed, watch } from 'vue'
import Lyric from 'lyric-parser'

import { useStoreSongs } from '@/stores/songs'
import { getLyric } from '@/service/song'
export default function useLyrics({ songReady, currentTime }) {
  const storeSongs = useStoreSongs()

  const refLyricScroll = ref(null)
  const refLyricList = ref(null)

  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  const currentSong = computed(() => storeSongs.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.id || !newSong.url) return

    stopLyric()
    // 来回切换歌词跳动
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    storeSongs.addSongLyric({ song: newSong, lyric })

    // 切换歌曲时，上次返回不在使用
    if (currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyrics = currentLyric.value.lines.length
    if (hasLyrics) {
      // 有歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      // [00:00:00]该歌曲暂时无法获取歌词
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  function playLyric() {
    currentLyric.value && currentLyric.value.seek(currentTime.value * 1000)
  }
  function stopLyric() {
    currentLyric.value && currentLyric.value.stop()
  }

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const lyricScroll = refLyricScroll.value
    const lyricList = refLyricList.value
    if (!lyricList) {
      return
    }

    const delta = 5
    if (lineNum > delta) {
      const lyricListChildren = lyricList.children
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
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}
