import { crudListByFilterAndRefs, crudUpdate } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    // 获取申请列表
    this.getList()
  },
  // 获取申请列表
  getList() {
    const params = {
      resource: 'friends',
      data: {
        toUser: this.data.userInfo._id,
        status: 0,
        refs: 'fromUserInfo'
      }
    }
    crudListByFilterAndRefs(params).then(res => {
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
  // 同意添加好友
  aggree(e) {
    const { id } = e.currentTarget.dataset
    const params = {
      resource: 'friends',
      id,
      data: {
        status: 1
      }
    }
    crudUpdate(params).then(() => {
      wx.showToast({
        title: '已同意',
        icon: 'none'
      })
      this.getList()
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  }
})