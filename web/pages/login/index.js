import { bind } from '../../api/adminUser'
const app = getApp()
Page({
  data: {
    title: '',
    loginText: '登录'
  },
  onLoad: function (options) {
    this.setData({
      title: options.title
    })
  },
  // 表单提交
  formSubmit(e) {
    if (!e.detail.value.password || !e.detail.value.phone) {
      wx.showToast({
        title: '表单信息不完整',
        icon: 'none'
      })
    }
    this.setData({
      loginText: '登录中...'
    })
    wx.login({
      success: res => {
        const data = { code: res.code, ...e.detail.value }
        bind({ data }).then(res => {
          wx.setStorageSync('token', res.token)
          app.globalData.token = res.token
          app.globalData.userInfo = res.userInfo
          wx.redirectTo({
            url: '/pages/index/index',
          })
          this.setData({
            loginText: '登录'
          })
        }, err => {
          wx.showToast({
            title: err.message,
            icon: 'none'
          })
          this.setData({
            loginText: '登录'
          })
        })
      },
      fail: () => {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
        this.setData({
          loginText: '登录'
        })
      }
    })
  },
  // 前往注册账号页面
  toRegister() {
    wx.navigateTo({
      url: '/pages/register/index',
    })
  }
})