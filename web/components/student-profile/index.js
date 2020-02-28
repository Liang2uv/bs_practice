import { getGlobalData, setGlobalData, clearToken, clearGlobalData } from '../../utils/util'
import { uploadImage } from '../../utils/file'
import { crudUpdate } from '../../api/crud'
import { getUserInfoByToken } from '../../api/adminUser'
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isPullDownRefresh: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    oldIsPullDownRefresh: false
  },
  /**
   * 数据监听器
   */
  observers: {
    'isPullDownRefresh': function (newValue) {
      if (this.data.oldIsPullDownRefresh !== this.data.isPullDownRefresh) {
        this.refresh()
        this.setData({
          oldIsPullDownRefresh: newValue
        })
      }
    }
  },
  /**
   * 生命周期
   */
  lifetimes: {
    attached: function () {
      const userInfo = getGlobalData('userInfo')
      this.setData({
        userInfo: userInfo || {}
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新的方法
    refresh() {
      this.getUserInfo()
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfoByToken().then(res => {
        setGlobalData('userInfo', res)
        this.setData({
          userInfo: res
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    },
    // 更换头像
    updateAvatar() {
      wx.showModal({
        title: '头像',
        content: '是否更换头像',
        showCancel: false,
        confirmText: '更换头像',
        success: (res) => {
          if (res.confirm) {
            uploadImage().then(img => {
              return crudUpdate({
                resource: 'admin_users',
                id: this.data.userInfo._id,
                data: {
                  avatar: img.url
                }
              })           
            }).then(user => {
              wx.showToast({
                title: '更换成功',
                icon: 'none'
              })
              setGlobalData('userInfo', user)
              this.setData({
                userInfo: user
              })
            }).catch( err => {
              wx.showToast({
                title: err.message,
                icon: 'none'
              })
            })
          }
        }
      })
    },
    // 注销与登录
    loginout() {
      wx.showModal({
        title: '注销',
        content: '是否要退出登录？',
        success: e => {
          if (e.confirm) {
            clearToken()
            clearGlobalData()
            wx.redirectTo({
              url: '/pages/login/index',
            })
          }
        }
      })
    },
    // 编辑资料
    toEditInfo() {
      wx.showToast({
        title: '暂不支持编辑',
        icon: 'none'
      })
    }
  }
})
