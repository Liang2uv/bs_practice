import { bind } from '../../api/adminUser'
const { $Toast } = require('../../components/iview/base/index')
const app = getApp()
Page({
  data: {
    title: '',
    spinShow: false
  },
  onLoad: function (options) {
    this.setData({
      title: options.title
    })
  },
  // 表单提交
  formSubmit(e) {
    if (!e.detail.value.password || !e.detail.value.phone) {
      return $Toast({
        content: '表单信息不完整',
        type: 'warning'
      })
    }
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
        }, err => {
          $Toast({
            content: err.message,
            type: 'error'
          })
        })
      },
      fail: () => {
        $Toast({
          content: '登录失败',
          type: 'error'
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