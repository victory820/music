import { ref } from 'vue'
// import animation from 'create-keyframe-animation'
export default function useAnimation(refCD) {
  const refCDWrapper = ref(null)

  console.log('====', refCD)

  function enter() {}
  function afterEnter() {}
  function leave() {}
  function afterLeave() {}

  function getPosAndScale() {}

  return {
    refCDWrapper,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
