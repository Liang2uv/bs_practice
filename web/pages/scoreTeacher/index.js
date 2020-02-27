import { getGlobalData } from '../../utils/util'
import { getMainPlanListForTeacher } from '../../api/mainPlan'
import { getScoreList, calcScoreForMainPlan } from '../../api/score'
import { $wuxDialog } from '../../components/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: {
      stuSearch: '',
      mainPlan: null,
      page: 1,
      size: 50
    },
    userInfo: {},
    mainPlanList: [],
    mainPlanDisplay: '',
    list: [],
    scrollHeight: 0,
    isLoading: false,
    scrollFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    // 设置列表栏的高度
    this.setScorllHeight()
    // 获取老师管理的实习计划列表
    this.getMainPlanList()
  },
  // 获取老师管理的实习计划列表
  getMainPlanList() {
    getMainPlanListForTeacher({ data: { teacher: this.data.userInfo._id } }).then(res => {
      if (res.length > 0) {
        this.setData({
          ['model.mainPlan']: res[0]._id,
          mainPlanDisplay: res[0].name,
          mainPlanList: res.map(v => ({ title: v.name, value: v._id }))
        })
        // 获取成绩列表
        this.getList()
      }
    })
  },
  // 实习计划改变
  pickerChange(e) {
    this.setData({
      ['model.mainPlan']: e.detail.selectedValue,
      mainPlanDisplay: e.detail.displayValue
    })
  },
  // 表单提交
  formSubmit(e) {
    const { value } = e.detail
    this.setData({
      ['model.stuSearch']: value.stuSearch,
      ['model.page']: 1,
      list: []
    })
    // 获取成绩列表
    this.getList()
  },
  // 获取成绩列表
  getList() {
    if (!this.data.scrollFlag && !this.data.model.mainPlan) {
      return
    }
    this.setData({
      isLoading: true
    })
    getScoreList({ data: this.data.model }).then(res => {
      if (res.list.length > 0) {
        this.setData({
          list: this.data.list.concat(res.list)
        })
      } else {  // 数据加载完毕，不能再拉取下一页数据了
        this.setData({
          scrollFlag: false  // 不允许再滚动获取数据 
        })
      }
      this.setData({
        isLoading: false
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
      this.setData({
        isLoading: false
      })
    })
  },
  // 设置列表栏的高度
  setScorllHeight () {
    try {
      const res = wx.getSystemInfoSync()
      this.setData({
        scrollHeight: res.windowHeight - 60 - 157
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  // 滚动条触底事件
  onScrolltolower(e) {
    if (this.data.scrollFlag) {
      this.setData({
        [`model.page`]: this.data.model.page + 1
      })
      this.getList()
    }
  },
  // 更新数据
  updateData() {
    $wuxDialog().alert({
      resetOnClose: true,
      title: '提示',
      content: '将统计当前实习计划已完成任务的所有学生的总成绩，此操作需要一定时间，是否继续？',
      onConfirm: () => {
        calcScoreForMainPlan({ data: { mainPlan: this.data.model.mainPlan } }).then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
          this.setData({
            ['model.page']: 1,
            list: []
          })
          // 获取成绩列表
          this.getList()
        }, err => {
          wx.showToast({
            title: err.message,
            icon: 'none'
          })
        })
      },
    })
  }
})