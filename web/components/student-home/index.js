import { login } from '../../api/adminUser'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 生命周期
   */
  lifetimes: {
    attached: function () {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    login() {
      if (getApp().globalData.token) {
        wx.checkSession({
          success() {
            console.log('登录态有效');
          },
          fail() {
            wx.login({
              success(res) {
                if (res.code) {
                  login({ code: res.code })
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            })
          }
        })
      } else {
        wx.login({
          success(res) {
            if (res.code) {
              login({ phone: '13768131071', password: '123456', code: res.code }).then(res => {
                console.log(res);
              }).catch(err => {
                console.log(err);
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    }
  }
})
