import { crudListByFilter } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resource: 'tasks',
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
    this.getList()
  },
  onShow() {
    this.getList()
  },
  // 获取列表
  getList() {
    const params = { resource: this.data.resource, data: { applicant: this.data.userInfo._id } }
    crudListByFilter(params).then(res => {
      this.setData({
        list: res.map(v => {
          switch(v.status) {
            case 0: v.statusName = '审核中';v.statusColor='grey';break;
            case 1: v.statusName = '审核未通过';v.statusColor='red';break;
            case 2: v.statusName = '未开始';v.statusColor='blue';break;
            case 3: v.statusName = '进行中';v.statusColor='green';break;
            case 4: v.statusName = '已完成';v.statusColor='yellow';break;
          }
          return v
        })
      })
    })
  },
  // 前往详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/taskEdit/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 前往签到列表
  toClockList(e) {
    const { task } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/clockList/index?task=' + task
    })
  }
})