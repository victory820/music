import { ref } from 'vue'

export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {
    startX: 0
  }
  // 存储下移动到的类型，移动过程中不能以currentShow为准
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  function onMiddleTouchMove(e) {
    // 从右往左使负数，从左往右是正数
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 锁定滚动方向
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    if (touch.directionLocked === 'v') {
      return
    }
    // 移动的距离是正数，所以用-winWidth
    const winWidth = window.innerWidth
    // 隐藏的歌词所要往左移动的距离。起始位置为0
    const left = currentView === 'cd' ? 0 : -winWidth
    // 所偏移的距离。现在一个屏幕
    const offsetWidth = Math.min(0, Math.max(-winWidth, deltaX + left))

    touch.movePercent = Math.abs(offsetWidth / winWidth)

    if (currentView === 'cd') {
      if (touch.movePercent > 0.2) {
        // 右往左移动超过屏幕20%
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.movePercent < 0.8) {
        // 左往右移动了20%
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.movePercent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
  function onMiddleTouchEnd() {
    const duration = 300
    let opacity = 0
    let offsetWidth = 0
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      opacity = 1
      offsetWidth = 0
    } else {
      currentView = 'lyric'
      opacity = 0
      offsetWidth = -window.innerWidth
    }
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
