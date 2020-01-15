const app = getApp()
export function getToken() {
  return wx.getStorageSync('token')
}
export function setToken(token) {
  wx.setStorageSync('token', token)
}

export function getGlobalData(key) {
  return app.globalData[key]
}

export function setGlobalData(key, value) {
  app.globalData[key] = value
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