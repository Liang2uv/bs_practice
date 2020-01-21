import { getGlobalData, setGlobalData } from '../../utils/util'
import { getCurrentTask } from '../../api/task'
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    currentTask: null,
    isPullDownRefresh: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    oldIsPullDownRefresh: false,
    userInfo: {}
  },
  /**
   * 数据监听器
   */
  observers: {
    'isPullDownRefresh': function (newValue) {
      if (this.data.oldIsPullDownRefresh !== this.data.isPullDownRefresh) {
        this.refresh()
        this.setData({
          oldIsPullDownRefresh: newValue
        })
      }
    }
  },
  /**
   * 生命周期
   */
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: getGlobalData('userInfo') || {}
      })
      this.getCurrentTask()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新的方法
    refresh() {
      this.getCurrentTask()
    },
    // 获取当前实习任务信息
    getCurrentTask() {
      getCurrentTask().then(res => {
        setGlobalData('currentTask', res)
        this.setData({
          currentTask: res
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    },
    // 前往签到页面
    toClock() {
      if (!this.data.currentTask) {
        wx.showToast({
          title: '当前无任务需要签到',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: '/pages/clock/index',
      })
    },
    // 前往请假申请页面
    toDayOff() {
      if (!this.data.currentTask) {
        wx.showToast({
          title: '当前无任务需要请假',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: '/pages/dayOffEdit/index',
      })
    },
    // 前往实习记录编辑页面
    toNote(e) {
      const { type, title } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/noteEdit/index?type=${type}&title=${title}`,
      })
    }
  }
})
