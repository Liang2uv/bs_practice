const app = getApp()
export function getToken() {
  return wx.getStorageSync('token')
}
export function setToken(token) {
  wx.setStorageSync('token', token)
}

export function clearToken() {
  wx.removeStorageSync('token')
}

export function getGlobalData(key) {
  return app.globalData[key]
}

export function setGlobalData(key, value) {
  app.globalData[key] = value
}

export function clearGlobalData() {
  app.globalData = {}
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export function dateCompare(date1, date2) {
  date1 = date1 instanceof Date ? date1 : new Date(date1)
  date2 = date2 instanceof Date ? date2 : new Date(date2)
  return date1.getTime() <= date2.getTime()
}

function padStart(num) {
  return num < 10 ? "0" + num : num
}

export function dateFormat(date, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) {
    return ""
  }
  date = date instanceof Date ? date : new Date(date)
  var year = date.getFullYear()
  var month = (padStart(date.getMonth() + 1))
  var day = padStart(date.getDate())
  var hour = padStart(date.getHours())
  var minute = padStart(date.getMinutes())
  var second = padStart(date.getSeconds())
  return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', second)
}