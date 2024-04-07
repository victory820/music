import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const specialClass = 'g-relative'

export default function upImgDownText(component) {
  return {
    mounted(el, binding) {
      // 创建一个vue实例
      const app = createApp(component)
      // 挂载到一个新容器上
      const instance = app.mount(document.createElement('div'))

      const compName = component.name
      // 作用在同一个组件时，区分组件
      if (!el[compName]) {
        el[compName] = {}
      }
      // 暂存下这个实例，其他地方使用
      el[compName].instance = instance
      const { value, arg } = binding
      if (typeof arg !== 'undefined') {
        // 需要组件暴露出来
        instance.setText(arg)
      }
      if (value) {
        append(el)
      }
    },
    updated(el, binding) {
      const { value, oldValue, arg } = binding
      const compName = component.name
      if (typeof arg !== 'undefined') {
        el[compName].instance.setText(arg)
      }
      if (value !== oldValue) {
        value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const style = getComputedStyle(el)
    const compName = component.name
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, specialClass)
    }
    el.appendChild(el[compName].instance.$el)
  }
  function remove(el) {
    const compName = component.name
    removeClass(el, specialClass)
    el.removeChild(el[compName].instance.$el)
  }
}
