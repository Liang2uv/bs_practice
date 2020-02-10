import { getGlobalData } from '../../utils/util'
import tabbarData from './tabbar'
Page({
  data: {
    curTab: 0,
    role: '',
    tabbar: []
  },
  onLoad() {
    const userInfo = getGlobalData('userInfo')
    if (!userInfo || !userInfo.role || !['student', 'teacher', 'officer'].includes(userInfo.role)) {
      return wx.redirectTo({
        url: '/pages/errorPage/index',
      })
    }
    this.setData({
      role: userInfo.role,
      tabbar: tabbarData[userInfo.role]
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    const index = this.data.curTab
    this.setData({
      [`tabbar[${index}].isPullDownRefresh`]: !this.data.tabbar[index].isPullDownRefresh
    })
    wx.stopPullDownRefresh()
  },
  // tab改变
  tabChange(e) {
    this.setData({
      curTab: parseInt(e.currentTarget.dataset.tab)
    })
  }
})