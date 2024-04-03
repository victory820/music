export function setLocal(key, val) {
  let tempVal = val
  if (typeof val === 'object') {
    tempVal = JSON.stringify(val)
  }
  localStorage.setItem(key, tempVal)
}

export function getLocal(key) {
  const val = localStorage.getItem(key)
  if (val) {
    try {
      return JSON.parse(val)
    } catch (e) {
      return val
    }
  } else {
    return null
  }
}
export function removeLocal(key) {
  localStorage.removeItem(key)
}
export function clearLocal() {
  localStorage.clear()
}
export function setSession(key, val) {
  let tempVal = val
  if (typeof val === 'object') {
    tempVal = JSON.stringify(val)
  }
  sessionStorage.setItem(key, tempVal)
}
export function getSession(key) {
  const val = sessionStorage.getItem(key)
  if (val) {
    try {
      return JSON.parse(val)
    } catch (e) {
      return val
    }
  } else {
    return null
  }
}
export function removeSession(key) {
  sessionStorage.removeItem(key)
}
export function clearSession() {
  sessionStorage.clear()
}
