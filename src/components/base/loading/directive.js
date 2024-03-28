import LoadingComponent from './Index.vue'

export const loading = {
  mounted(el, binding) {
    const { value } = binding
    if (value) {
      // 展示loading
      console.log('--', el)
      appendLoading(el)
    }
  },
  updated(el, binding) {
    const { value } = binding
    if (!value) {
      // 移除loading
      removeLoading(el)
    }
  }
}

function appendLoading(el) {
  el.appendChild(el.instance)
}
function removeLoading(el) {
  el.removeChild(el.instance)
}
