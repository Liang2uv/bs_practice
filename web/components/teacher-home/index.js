import { getGlobalData } from '../../utils/util'
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
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新的方法
    refresh() {
    },
    // 前往实习记录
    toNote(e) {
      const { title, type } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/noteReview/index?title=${title}&type=${type}`,
      })
    },
    // 前往学生成绩列表
    toScore() {
      wx.navigateTo({
        url: '/pages/scoreTeacher/index',
      })
    },
    // 前往签到统计列表
    toClockSummary() {
      wx.navigateTo({
        url: '/pages/clockSummary/index',
      })
    }
  }
})
