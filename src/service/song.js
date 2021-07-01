import { get } from './base'

export function processSongs (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  }).then(result => {
    const map = result.map
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => {
      // 处理没有vkey的数据，没有vkey是无法播放的
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

// 保存下歌曲mid和歌词
const lyricMap = {}
export function getLyric (song) {
  if (song.lyric) {
    // 如果请求过歌词，直接使用缓存
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  // 本地在存一份歌词，如果存在直接返回
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {
    mid
  }).then(result => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    return lyric
  })
}
