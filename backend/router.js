/*
 * 该文件是运行在 Node.js 端的，获取数据的基本的思路就是后端代理，即提供接口路由供前端页面使用，然后在路由内部，我们接收到前端请求后，再发送 HTTP 请求到第三方服务接口，携带相应的请求参数，包括签名的参数字段等等。
 * 对于从第三方接口返回的数据，我们会做一层数据处理，最终提供给前端的数据前端可以直接使用，无需再处理。这样也比较符合真实企业项目的开发规范，即数据的处理放在后端做，前端只做数据渲染和交互。
 */

import axios from 'axios'
import pinyin from 'pinyin'

import querystring from 'node:querystring'

// 获取签名
import getSecuritySign from './sign.cjs'
import { Base64 } from 'js-base64'

const ERR_OK = 0
const token = 5381

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl =
  'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

// 获取随机数值
function getRandomVal(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '')
}
// 获取随机uid
function getUid() {
  const t = new Date().getUTCMilliseconds()
  return '' + ((Math.round(2147483647 * Math.random()) * t) % 1e10)
}

function get(url, params) {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    params: Object.assign({}, commonParams, params)
  })
}

function post(url, params) {
  return axios.post(url, params, {
    headers: {
      Referer: 'https://y.qq.com/',
      Origin: 'https://y.qq.com/',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

function getUrlParams(url) {
  const urlAfter = url.substring(url.indexOf('?') + 1)
  if (!urlAfter) {
    return {}
  }
  const params = querystring.parse(urlAfter)
  return params
}
function handleSongList(list) {
  const songList = []
  list.forEach((item) => {
    const info = item.songInfo || item
    if (info.pay.pay_play !== 0 || !info.interval) {
      // 过滤付费歌曲和获取不到时长的歌曲
      return
    }

    const song = {
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: '', // 在另一个接口获取
      duration: info.interval,
      pic: info.album.mid
        ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000`
        : fallbackPicUrl,
      album: info.album.name
    }

    songList.push(song)
  })
  return songList
}

// 合并多个歌手的姓名
function mergeSinger(singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
//===============================================interface========================================
// 注册推荐列表接口路由
function registerRecommend(app) {
  // 使用use方法
  app.use('/api/getRecommend', (req, res) => {
    // 第三方服务接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2 },
        module: 'playlist.HotRecommendServer'
      },
      focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
    })
    // 随机数值
    const randomVal = getRandomVal('recom')
    // 计算签名值
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomVal,
      data
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        // 轮播图
        const focusList = data.focus.data.shelf.v_niche[0].v_card
        const sliders = []
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }

        // 最多获取 10 条数据
        const len = Math.min(focusList.length, 10)
        for (let i = 0; i < len; i++) {
          const item = focusList[i]
          const sliderItem = {}
          // 单个轮播图数据包括 id、pic、link 等字段
          sliderItem.id = item.id
          sliderItem.pic = item.cover
          if (jumpPrefixMap[item.jumptype]) {
            sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html'
          } else if (item.jumptype === 3001) {
            sliderItem.link = item.id
          }

          sliders.push(sliderItem)
        }

        // 处理推荐歌单数据
        const albumList = data.recomPlaylist.data.v_hot
        const albums = []
        for (let i = 0; i < albumList.length; i++) {
          const item = albumList[i]
          const albumItem = {}
          // 推荐歌单数据包括 id、username、title、pic 等字段
          albumItem.id = item.content_id
          albumItem.username = item.username
          albumItem.title = item.title
          albumItem.pic = item.cover

          albums.push(albumItem)
        }
        // 往前端发送一个标准格式的响应数据，包括成功错误码和数据
        // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              sliders,
              albums
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })
}
// 注册歌手列表接口
function registerSingerList(app) {
  app.use('/api/getSingerList', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    const HOT_NAME = '热'

    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: { area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
      }
    })

    const randomKey = getRandomVal('getUCGI')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        const singerList = data.singerList.data.singerlist

        const singerMap = {
          // 默认前十个是热门
          hot: {
            title: HOT_NAME,
            list: map(singerList.slice(0, 10))
          }
        }
        singerList.forEach((item) => {
          // 歌手名转拼音
          const p = pinyin(item.singer_name)
          if (!p || !p.length) {
            return
          }
          const key = p[0][0].slice(0, 1).toUpperCase()
          if (key) {
            if (!singerMap[key]) {
              singerMap[key] = {
                title: key,
                list: []
              }
            }
            // 字母下的歌手
            singerMap[key].list.push(map([item])[0])
          }
        })

        const hot = []
        const letter = []

        for (const key in singerMap) {
          const item = singerMap[key]
          if (item.title.match(/[a-zA-Z]/)) {
            letter.push(item)
          } else if (item.title === HOT_NAME) {
            hot.push(item)
          }
          // letter.push(item)
        }

        letter.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              singers: hot.concat(letter)
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })

  function map(singerList) {
    return singerList.map((item) => {
      return {
        id: item.singer_id,
        mid: item.singer_mid,
        name: item.singer_name,
        pic: item.singer_pic.replace(/\.webp$/, '.jpg').replace('150x150', '800x800')
      }
    })
  }
}
// 注册歌手详情接口
function registerSingerDetail(app) {
  app.use('/api/getSingerDetail', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    const mid = getUrlParams(req.url).mid || ''
    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerSongList: {
        method: 'GetSingerSongList',
        param: { order: 1, singerMid: mid, begin: 0, num: 100 },
        module: 'musichall.song_list_server'
      }
    })
    const randomKey = getRandomVal('getSingerSong')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        const list = data.singerSongList.data.songList
        const songList = handleSongList(list)
        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              songs: songList
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })
}
// 歌曲url获取
function registerSongsUrl(app) {
  app.use('/api/getSongUrl', (req, res) => {
    let midStr = getUrlParams(req.url).mid || ''
    let mids = []
    if (midStr) {
      mids = midStr.split(',')
    }

    let midGroup = []
    const maxMidsLen = 100
    // 最多处理100条，超过后分组请求数据
    if (mids.length > maxMidsLen) {
      const groupLen = Math.ceil(mids.length / maxMidsLen)
      for (let i = 0; i < groupLen; i++) {
        midGroup.push(mids.slice(i * maxMidsLen, maxMidsLen * (i + 1)))
      }
    } else {
      midGroup = [mids]
    }

    const urlMap = {}

    function process(mids) {
      const data = {
        comm: {
          format: 'json',
          platform: 'yqq.json',
          uin: 0,
          g_tk: token
        },
        req_1: {
          module: 'vkey.GetVkeyServer',
          method: 'CgiGetVkey',
          param: {
            guid: getUid(),
            songmid: mids,
            songtype: new Array(mids.length).fill(0),
            uin: '0',
            loginflag: 0,
            platform: '20'
          }
        }
      }
      const sign = getSecuritySign(JSON.stringify(data))
      // 参照此文章https://github.com/ustbhuangyi/vue-music/issues/111
      // 进入到播放页面，https://y.qq.com/n/ryqq/player查看此接口
      // 参照post的接口
      const url = `https://u6.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

      // 这里要传字符串，所以使用JSON.stringify(data)
      return post(url, JSON.stringify(data)).then((response) => {
        const data = response.data
        if (data.code === ERR_OK) {
          const midInfo = data.req_1.data.midurlinfo
          const sip = data.req_1.data.sip
          const domain = sip[sip.length - 1]
          midInfo.forEach((info) => {
            // 获取歌曲的真实播放 URL
            urlMap[info.songmid] = domain + info.purl
          })
        }
      })
    }
    // 构造多个 Promise 请求
    const requests = midGroup.map((mid) => {
      return process(mid)
    })

    // 并行发送多个请求
    return Promise.all(requests).then(() => {
      // 所有请求响应完毕，urlMap 也就构造完毕了
      res.end(
        JSON.stringify({
          code: ERR_OK,
          result: {
            map: urlMap
          }
        })
      )
    })
  })
}

function registerLyric(app) {
  app.use('/api/getLyric', (req, res) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

    let midStr = getUrlParams(req.url).mid || ''
    if (!midStr) {
      console.log('暂无mid')
      return
    }

    get(url, {
      '-': 'MusicJsonCallback_lrc',
      pcachetime: +new Date(),
      songmid: midStr,
      g_tk_new_20200303: token
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              lyric: Base64.decode(data.lyric)
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })
}

function registerAlbum(app) {
  app.use('/api/getAlbum', (req, res) => {
    let idStr = getUrlParams(req.url).id || ''
    if (!idStr) {
      console.log('暂无id')
      return
    }

    const data = {
      req_0: {
        module: 'srf_diss_info.DissInfoServer',
        method: 'CgiGetDiss',
        param: {
          disstid: Number(idStr),
          onlysonglist: 1,
          song_begin: 0,
          song_num: 100
        }
      },
      comm: {
        g_tk: token,
        uin: '0',
        format: 'json',
        platform: 'h5'
      }
    }
    const sign = getSecuritySign(JSON.stringify(data))

    const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

    post(url, JSON.stringify(data)).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        const list = data.req_0.data.songlist
        const songList = handleSongList(list)
        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              songs: songList
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })
}

function registerTopList(app) {
  app.use('/api/getTopList', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    const data = JSON.stringify({
      comm: { ct: 24 },
      toplist: { module: 'musicToplist.ToplistInfoServer', method: 'GetAll', param: {} }
    })

    const randomKey = getRandomVal('recom')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        const topList = []
        const group = data.toplist.data.group

        group.forEach((item) => {
          item.toplist.forEach((second) => {
            topList.push({
              id: second.topId,
              pic: second.frontPicUrl,
              name: second.title,
              period: second.period,
              songList: second.song.map((song) => {
                return {
                  id: song.songId,
                  singerName: song.singerName,
                  songName: song.title
                }
              })
            })
          })
        })
        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              topList
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })
}
function registerTopDetail(app) {
  app.use('/api/getTopDetail', (req, res) => {
    console.log('----', getUrlParams(req.url))

    const obj = getUrlParams(req.url)
    const { id, period } = obj
    if (!id || !period) {
      console.log('暂无id或period')
      return
    }
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    const data = JSON.stringify({
      detail: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetDetail',
        param: {
          topId: Number(id),
          offset: 0,
          num: 100,
          period
        }
      },
      comm: {
        ct: 24,
        cv: 0
      }
    })

    const randomKey = getRandomVal('getUCGI')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        const list = data.detail.data.songInfoList
        console.log('----3----', list)
        const songList = handleSongList(list)

        res.end(
          JSON.stringify({
            code: ERR_OK,
            result: {
              songs: songList
            }
          })
        )
      } else {
        res.end(JSON.stringify(data))
      }
    })
  })
}
export default function registerRouter(app) {
  registerRecommend(app)
  registerSingerList(app)
  registerSingerDetail(app)
  registerSongsUrl(app)
  registerLyric(app)
  registerAlbum(app)
  registerTopList(app)
  registerTopDetail(app)
}
