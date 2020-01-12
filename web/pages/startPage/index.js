import { getToken, setToken, getGlobalData, setGlobalData } from '../../utils/util'
import { login, getUserInfoByToken } from '../../api/adminUser'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = getToken()
    if (token) {
      setGlobalData('token', token)
      wx.checkSession({
        success: () => {
          //session_key 未过期
          getUserInfoByToken().then(res => {
            setGlobalData('userInfo', res)
            this.toIndexPage()
          }, () => {
            this.toLoginPage('登录')
          })
        },
        fail: () => {
          //session_key 过期
          this.onLogin()
        }
      })
    } else {
      this.onLogin()
    }
  },
  // 登录操作
  onLogin() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        login({ code: res.code }).then(res => {
          setToken(res.token)
          setGlobalData('token', res.token)
          setGlobalData('userInfo', res.userInfo)
          this.toIndexPage()
        }, err => {
          err.message === '未绑定手机号' ? this.toLoginPage('账号绑定') : this.toLoginPage('登录')
        })
      },
      fail: () => {
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        })
        this.toLoginPage('登录')
      }
    })
  },
  // 跳转到手机号登录页面
  toLoginPage(title) {
    wx.redirectTo({
      url: `/pages/login/index?title=${title}`
    })
  },
  // 跳转到首页
  toIndexPage() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
})