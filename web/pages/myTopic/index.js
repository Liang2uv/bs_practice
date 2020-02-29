import { getGlobalData } from '../../utils/util'
import { crudListByFilterAndRefsPaging } from '../../api/crud'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId: null,
    userInfo: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      circleId: options.circle,
      userInfo: getGlobalData('userInfo') || {}
    })
    this.getList()
  },
  // 获取列表
  getList() {
    const params = {
      resource: 'circle_topics',
      data: {
        circle: this.data.circleId,
        user: this.data.userInfo._id,
        refs: 'userInfo|topicInfo',
        page: 1,
        size: 50
      }
    }
    crudListByFilterAndRefsPaging(params).then(res => {
      if (res.list.length !== 0) {
        this.setData({
          list: res.list
        })
      }
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 查看图片
  viewImage(e) {
    const { imgs, url } = e.currentTarget.dataset
    wx.previewImage({
      urls: imgs,
      current: url
    });
  },
  // 前往帖子详情页
  toDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/topicDetail/index?id=' + id,
    })
  }
})