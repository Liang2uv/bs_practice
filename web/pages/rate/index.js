import { getGlobalData } from '../../utils/util'
import { crudListByFilterAndRefs } from '../../api/crud'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: null,
    userInfo: {},
    officerRate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      task: options.task,
      userInfo: getGlobalData('userInfo')
    })
    // 获取实习单位评价
    this.getOfficerRate()
  },
  // 获取实习单位评价
  getOfficerRate() {
    const params = {
      resource: 'rates',
      data: {
        task: this.data.task,
        type: 'officer',
        status: 1,
        refs: 'raterInfo'
      }
    }
    crudListByFilterAndRefs(params).then(res => {
      if (res.length > 0) {
        this.setData({
          officerRate: res[0]
        })
      }
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 邀请负责人评价
  invite() {
    wx.navigateTo({
      url: `/pages/friend/index?handle=rate&task=${this.data.task}`,
    })
  }
})