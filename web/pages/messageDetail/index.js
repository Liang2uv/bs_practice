import { crudListByFilterAndRefs } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
import { updateMessageStatusBulk } from '../../api/message'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    title: '系统消息',
    type: 'system',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      type: options.type,
      userInfo: getGlobalData('userInfo') || {}
    })
    // 获取列表
    this.getList()
  },
  // 获取列表
  getList() {
    crudListByFilterAndRefs({
      resource: 'messages',
      data: {
        receive: this.data.userInfo._id,
        type: this.data.type,
        refs: 'sendInfo'
      }
    }).then(res => {
      this.setData({
        list: res
      })
      this.updateStatus()
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 批量修改消息状态
  updateStatus() {
    const ids = this.data.list.map(v => {
      if (v.status === 0) {
        return v._id
      }
    })
    const data = {
      status: 1,
      ids
    }
    updateMessageStatusBulk({ data })
  },
  // 前往关联页面
  toRef(e) {
    if (this.data.type === 'comment') {
      const { remark } = e.currentTarget.dataset
      if (remark && remark !== 'undefined') {
        wx.navigateTo({
          url: '/pages/topicDetail/index?id=' + remark,
        })
      }
    }
  }
})