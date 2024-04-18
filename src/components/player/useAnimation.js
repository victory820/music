import { ref } from 'vue'
import animations from 'create-keyframe-animation'
export default function useAnimation() {
  const refCDWrapper = ref(null)
  // 动画时间长时，动画没有执行完，切换时会没有动画，所以设置下面标志
  let entering = false
  let leaving = false

  function enter(el, done) {
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(refCDWrapper.value, 'move', () => {
      // done执行完才会进入afterEnter
      done()
    })
  }
  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    refCDWrapper.value.animation = ''
  }
  function leave(el, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()

    const animation = {
      0: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      },
      100: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      }
    }

    animations.registerAnimation({
      name: 'leave',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(refCDWrapper.value, 'leave', () => {
      // done执行完才会进入afterEnter
      done()
    })

    // 不用第三方库
    // const cdWrapperEl = refCDWrapper.value
    // cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    // cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    // cdWrapperEl.addEventListener('transitionend', next)
    // function next() {
    //   cdWrapperEl.removeEventListener('transitionend', next)
    //   done()
    // }
  }
  function afterLeave() {
    leaving = false
    animations.unregisterAnimation('leave')
    refCDWrapper.value.animation = ''

    // 不使用第三方库
    // const cdWrapperEl = refCDWrapper.value
    // cdWrapperEl.style.transition = ''
    // cdWrapperEl.style.transform = ''
  }

  function getPosAndScale() {
    const targetWidth = 40 // 小cd宽度
    const paddingLeft = 40 // 小cd圆心距离左侧
    const paddingBottom = 30 // 小cd（mini-player）的圆心距离底部

    const paddingTop = 80 // 大圆（middle）距离顶部
    const bigWidth = window.innerWidth * 0.8 // 大圆的宽度就是80%

    // 大圆移动到小圆
    // 大圆圆心到小圆圆心的横轴距离；从右往左所以是负数
    const x = -(window.innerWidth / 2 - paddingLeft)
    // 大圆圆心到小圆圆心的竖轴距离
    const y = window.innerHeight - paddingTop - bigWidth / 2 - paddingBottom

    const scale = targetWidth / bigWidth

    return {
      x,
      y,
      scale
    }
  }

  return {
    refCDWrapper,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
