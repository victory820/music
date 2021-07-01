import storage from 'good-storage'
import MusicList from '@/components/music-list/music-list'
import { processSongs } from '@/service/song'

export default function createDetailComponent (name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data () {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData () {
        let ret = null
        const data = this.data
        // 从歌手列表过来
        if (data) {
          ret = data
        } else {
          // 从本地缓存获取
          const cached = storage.session.get(key)
          // 本地和url地址中的参数一致
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic () {
        const data = this.computedData
        return data && data.pic
      },
      title () {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created () {
      const data = this.computedData
      // 如果没有歌手数据返回上一级
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
