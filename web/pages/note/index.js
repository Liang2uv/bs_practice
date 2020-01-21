import { getGlobalData } from '../../utils/util'
import { crudListByFilterAndRefs } from '../../api/crud'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '列表',
    query: {
      type: '',
      task: '',
      student: '',
      refs: 'taskInfo|studentInfo'
    },
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { title, type, task } = options
    const userInfo = getGlobalData('userInfo') || {}
    this.setData({
      title: title,
      ['query.type']: type,
      ['query.task']: task,
      ['query.student']: userInfo._id
    })
    this.getList()
  },
  // 获取列表
  getList() {
    const params = {
      resource: 'notes',
      data: this.data.query
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
  // 添加
  toAdd() {
    wx.navigateTo({
      url: `/pages/noteEdit/index?type=${this.data.query.type}&title=${this.data.title}`,
    })
  },
  // 查看图片
  viewImage(e) {
    const { nodeindex, url } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.list[nodeindex].imgs,
      current: url
    });
  }
})