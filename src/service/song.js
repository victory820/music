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
