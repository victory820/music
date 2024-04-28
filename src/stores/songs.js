import { defineStore } from 'pinia'

import { PLAY_MODE } from '@/assets/js/const.js'
import { shuffle } from '@/assets/js/util'
import { FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/const'
import { load } from '@/assets/js/arrayStore'

export const useStoreSongs = defineStore('songs', {
  state: () => ({
    sequenceList: [],
    playList: [],
    playing: false, // 播放状态
    playMode: PLAY_MODE.sequence, // 播放模式
    currentIndex: 0, // 当前歌曲索引
    fullScreen: false, // 播放器是否全屏
    favoriteList: load(FAVORITE_KEY), // 收藏列表
    searchHistory: load(SEARCH_KEY) // 搜索历史
  }),
  getters: {
    currentSong(state) {
      return state.playList[state.currentIndex] || {}
    }
  },
  actions: {
    setPlayingState(playing) {
      this.playing = playing
    },
    setSequenceList(list) {
      this.sequenceList = list
    },
    setPlaylist(list) {
      this.playList = list
    },
    setPlayMode(mode) {
      this.playMode = mode
    },
    setCurrentIndex(index) {
      this.currentIndex = index
    },
    setFullScreen(fullScreen) {
      this.fullScreen = fullScreen
    },

    // 选中播放
    selectPlay({ list, index }) {
      this.setPlayingState(true)
      this.setFullScreen(true)
      this.setSequenceList(list)
      this.setPlaylist(list)
      this.setPlayMode(PLAY_MODE.sequence)
      this.setCurrentIndex(index)

      // 线上打印日志
      console.log(
        '选中播放====',
        this.sequenceList,
        this.playList,
        this.playing,
        this.playMode,
        this.currentIndex,
        this.fullScreen,
        this.favoriteList
      )
    },
    randomPlay(list) {
      this.setPlayingState(true)
      this.setFullScreen(true)
      this.setSequenceList(list)
      this.setPlaylist(shuffle(list))
      this.setPlayMode(PLAY_MODE.random)
      this.setCurrentIndex(0) // 固定播放第一个

      // 线上打印日志
      console.log(
        '随机播放====',
        this.sequenceList,
        this.playList,
        this.playing,
        this.playMode,
        this.currentIndex,
        this.fullScreen,
        this.favoriteList
      )
    },
    changeMode(mode) {
      // 更改播放模式
      const currentId = this.currentSong.id
      if (mode === PLAY_MODE.random) {
        this.setPlaylist(shuffle(this.sequenceList))
      } else {
        this.setPlaylist(this.sequenceList)
      }
      const index = this.playList.findIndex((song) => song.id === currentId)
      this.setCurrentIndex(index)
      this.setPlayMode(mode)
    },
    setFavoriteList(list) {
      this.favoriteList = list
    },
    addSongLyric({ song, lyric }) {
      this.sequenceList.map((item) => {
        if (item.mid === song.mid) {
          item.lyric = lyric
        }
        return item
      })
    },
    removeSong(song) {
      let currentIndex = this.currentIndex
      const sqListTemp = this.sequenceList.slice()
      const pListTemp = this.playList.slice()
      const sqListIndex = sqListTemp.findIndex((item) => item.id === song.id)
      const pListIndex = this.playList.findIndex((item) => item.id === song.id)
      if (pListIndex < 0 || sqListIndex < 0) {
        return
      }
      if (sqListIndex < currentIndex || currentIndex === pListTemp.length - 1) {
        currentIndex--
      }
      sqListTemp.splice(sqListIndex, 1)
      pListTemp.splice(pListIndex, 1)
      console.log('currentIndex', currentIndex)
      this.setSequenceList(sqListTemp)
      this.setPlaylist(pListTemp)
      this.setCurrentIndex(currentIndex)
      if (!this.playList.length) {
        this.playing = false
      }
    },
    clearSongsList() {
      this.sequenceList = []
      this.playList = []
      this.currentIndex = 0
      this.playing = false
    },
    addSong(song) {
      const sqList = this.sequenceList.slice()
      const pList = this.playList.slice()
      let currentIndex = this.currentIndex
      const pIndex = pList.findIndex((item) => item.id === song.id)

      if (pIndex > -1) {
        currentIndex = pIndex
      } else {
        pList.push(song)
        currentIndex = pList.length - 1
      }

      const sqIndex = sqList.findIndex((item) => item.id === song.id)
      if (sqIndex === -1) {
        sqList.push(song)
      }
      this.setSequenceList(sqList)
      this.setPlaylist(pList)
      this.setCurrentIndex(currentIndex)
      this.setPlayingState(true)
      this.setFullScreen(true)
    },
    setSearchHistory(history) {
      this.searchHistory = history
    }
  }
})
