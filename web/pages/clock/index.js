import { getDistance } from '../../utils/map'
import { getGlobalData, setGlobalData } from '../../utils/util'
import { crudUpdate } from '../../api/crud'
import { getCurrentTask } from '../../api/task'
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    currentTask: null
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad() {
    // 获取当前定位坐标
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
     })
     // 获取实习任务的坐标
     this.setData({
      currentTask: getGlobalData('currentTask')
     })
  },
  // 一键签到
  onClock() {
    if (!this.data.currentTask) {
      wx.showToast({
        title: '无需签到，无正在进行的实习任务',
        icon: 'none'
      })
      return
    }
    if (!this.data.currentTask.day || this.data.currentTask.day.status != 0) {
      wx.showToast({
        title: '无需签到',
        icon: 'none'
      })
      return
    }
    const lat1 = this.data.latitude
    const lng1 = this.data.longitude
    const lat2 = this.data.currentTask.address.latitude
    const lng2 = this.data.currentTask.address.longitude
    const dis = getDistance(lat1, lng1, lat2, lng2).toFixed(2)
    if (dis > 3000) { // 签到地点不能大于3km
      wx.showToast({
        title: '签到失败，超出签到范围',
        icon: 'none'
      })
      return
    }
    // 更新工作日状态
    const params = {
      resource: 'day_records',
      id: this.data.currentTask.day._id,
      data: {
        status: 1,
        clock: {
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          distance: dis
        }
      }
    }
    crudUpdate(params).then(() => {
      return getCurrentTask()
    }).then(res => {
      setGlobalData('currentTask', res)
      this.setData({
        currentTask: res
      })
      wx.showToast({
        title: '签到成功',
        icon: 'none'
      })
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  }
})
