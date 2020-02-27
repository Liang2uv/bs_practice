import { getStudentScore } from '../../api/score'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    // 获取学生成绩列表
    this.getList()
  },
  // 获取学生成绩列表
  getList() {
    getStudentScore({ data: { student: this.data.userInfo._id } }).then(res => {
      res.map(v => {
        v.content = `总成绩：${v.totalScore}分（签到成绩：${v.clockScore}分，实习日记：${v.noteDayScore}分，实习月记：${v.noteMonthScore}分，实习周记：${v.noteWeekScore}分，实习总结：${v.noteSummaryScore}分，实习单位评价分数：${v.companyScore}分）`
      })
      this.setData({
        list: res
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icons: 'none'
      })
    })
  }
})