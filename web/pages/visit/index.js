import { getGlobalData } from '../../utils/util'
import { crudListByFilterAndRefsPaging } from '../../api/crud'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    userInfo: {},
    scrollFlag: true,
    isLoading: false,
    query: {
      teacher: '',
      refs: 'student',
      page: 1,
      size: 30
    }
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
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      scrollFlag: true,
      list: []
    })
    this.getList()
  },
  // 获取列表
  getList() {
    if (this.data.scrollFlag) {
      this.setData({
        [`query.teacher`]: this.data.userInfo._id,
        isLoading: true
      })
      crudListByFilterAndRefsPaging({ resource: 'visits', data: this.data.query }).then(res => {
        if (res.list.length > 0) {
          res.list.map(v => {
            v.students = v.student.map(s => s.username).join('，')
          })
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
    }
  },
  // 前往详情
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/visitEdit/index?id=' + e.currentTarget.dataset.id,
    })
  }
})