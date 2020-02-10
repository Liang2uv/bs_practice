import { getFriendList } from '../../api/friend'
import { getGlobalData } from '../../utils/util'
import { inviteRate } from '../../api/rate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    userInfo: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      userInfo: getGlobalData('userInfo') || {}
    })
    // 获取好友列表
    this.getList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getList()
  },
  // 获取好友列表
  getList() {
    getFriendList().then(res => {
      this.setData({
        list: res
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 前往搜索好友
  toFriendSearch() {
    wx.navigateTo({
      url: '/pages/friendSearch/index',
    })
  },
  // 前往好友申请页面
  toFriendReview() {
    wx.navigateTo({
      url: '/pages/friendReview/index',
    })
  },
  // 邀请评价
  inviteRate(e) {
    const { user } = e.currentTarget.dataset
    const data = {
      task: this.data.options.task,
      rater: user._id,
      type: user.role
    }
    inviteRate({ data }).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  }
})