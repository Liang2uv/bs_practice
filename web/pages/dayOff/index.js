import { crudListByFilterAndRefs } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayOffList: [],
    taskId: null,
    statusArr: ['待审核', '已通过', '未通过']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      taskId: options.task
    })
    this.getList()
  },
  // 获取请假申请列表
  getList() {
    const params = {
      resource: 'day_offs',
      data: {
        student: getGlobalData('userInfo')._id,
        refs: 'taskInfo'
      }
    }
    if (this.data.taskId) {
      params.data.task = this.data.taskId
    }
    crudListByFilterAndRefs(params).then(res => {
      this.setData({
        dayOffList: res
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 前往请假详情页
  toDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/dayOffEdit/index?id=' + id,
    })
  },
  // 添加请假记录
  toDayOff() {
    wx.navigateTo({
      url: '/pages/dayOffEdit/index',
    })
  }
})