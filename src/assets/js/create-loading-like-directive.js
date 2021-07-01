import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

export default function createLoadingLikeDirective (Comp) {
  return {
    // 组件加载时触发函数
    mounted (el, binding) {
      // 创建一个vue实例
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      // 将实例挂载到el上在其他阶段可以使用
      el[name].instance = instance
      // 更改title
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }
      // 对应dom上的值
      if (binding.value) {
        append(el)
      }
    },
    // 组件更新时触发函数
    updated (el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      // 值改变判断是添加还是移除
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
  function append (el) {
    const name = Comp.name
    // 当挂载到的dom不是下面定位方式就自动给元素加上定位
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }
  function remove (el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
