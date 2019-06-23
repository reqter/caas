function setItem (name, value, days = 1) {
  var d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
  document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
}
function getItem (name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')

  return v ? v[2] : null
}
function removeItem (name) {
  setItem(name, '', -1)
}

const storage = { setItem, getItem, removeItem }
export default storage
