import { crudOneById } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteId: null,
    userInfo: {},
    noteInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      noteId: options.id,
      userInfo: getGlobalData('userInfo') || {}
    })
    this.getDetail()
  },
  // 获取日记详情
  getDetail() {
    crudOneById({ resource: 'notes', id: this.data.noteId }).then(res => {
      this.setData({
        noteInfo: res
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    })
  },
  // 查看图片
  viewImage(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.noteInfo.imgs,
      current: url
    });
  }
})