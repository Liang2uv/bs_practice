import { crudListByFilterAndOrder } from '../../api/crud'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: null,
    clockList: [],
    statusList: [
      { label: '待签到', color: '#aaaaaa' },
      { label: '已签到', color: '#39b54a' },
      { label: '已请假', color: '#fbbd08' },
      { label: '缺勤', color: '#e54d42' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      taskId: options.task
    })
    this.getClockList()
  },

  // 获取签到记录
  getClockList() {
    crudListByFilterAndOrder({ resource: 'day_records', data: {task: this.data.taskId, order: 'date_asc'} }).then(res => {
      this.setData({
        clockList: res
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'nonw'
      })
    })
  }
})