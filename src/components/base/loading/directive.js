import { createApp } from 'vue'
import Loading from './Index.vue'

import { addClass, removeClass } from '@/assets/js/dom'

const specialClass = 'g-relative'

const loadingDirective = {
  mounted (el, binding) {
    // 创建一个vue实例
    const app = createApp(Loading)
    // 挂载到一个新容器上
    const instance = app.mount(document.createElement('div'))

    // 暂存下这个实例，其他地方使用
    el.instance = instance
    const { value, arg } = binding
    if (typeof arg !== 'undefined') {
      // 需要组件暴露出来
      instance.setText(arg)
    }
    if (value) {
      append(el)
    }
  },
  updated (el, binding) {
    const { value, oldValue, arg } = binding
    if (typeof arg !== 'undefined') {
      el.instance.setText(arg)
    }
    if (value !== oldValue) {
      value ? append(el) : remove(el)
    }
  }
}

function append (el) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, specialClass)
  }
  el.appendChild(el.instance.$el)
}
function remove (el) {
  removeClass(el, specialClass)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
