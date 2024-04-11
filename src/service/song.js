import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongUrl', {
    mid: songs
      .map((song) => {
        return song.mid
      })
      .join(',')
  }).then((result) => {
    const map = result.map
    return songs
      .map((song) => {
        song.url = map[song.mid]
        return song
      })
      .filter((song) => {
        // 保证所有歌曲可播放
        return song.url && song.url.indexOf('vkey') > 0
      })
  })
}

const lyricMap = {}

export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }

  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
