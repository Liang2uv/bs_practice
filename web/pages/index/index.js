import { getGlobalData } from '../../utils/util'
Page({
  data: {
    curTab: '1',
    role: ''
  },
  onLoad() {
    const userInfo = getGlobalData('userInfo')
    if (!userInfo || !userInfo.role || !['student', 'teacher'].includes(userInfo.role)) {
      return wx.redirectTo({
        url: '/pages/errorPage/index',
      })
    }
    this.setData({
      role: userInfo.role
    })
  },
  tabChange(e) {
    this.setData({
      curTab: e.currentTarget.dataset.tab
    })
  }
})