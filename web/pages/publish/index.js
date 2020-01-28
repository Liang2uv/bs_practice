// pages/publish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 前往帖子编辑页面
  toTopicEdit(e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/topicEdit/index?type=' + type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})