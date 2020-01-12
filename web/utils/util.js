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