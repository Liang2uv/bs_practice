import { getGlobalData } from '../../utils/util'
import { crudAdd, crudUpdate, crudDelete } from '../../api/crud'
import { getCircleReviewList } from '../../api/circleUser'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId: null,
    currentTab: 0,
    tabList: [{
      id: 0,
      text: '待审核',
      isInit: true,
      scrollFlag: true,
      isLoading: false,
      query: {
        circle: '',
        status: 0,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 1,
      text: '已加入',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      list: [],
      query: {
        circle: '',
        status: 1,
        page: 1,
        size: 30
      },
    }],
    userInfo: {},
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {},
      circleId: options.id
    })
    // 获取签到记录列表
    this.getCurrentTabList()
    // 设置列表栏的高度
    this.setScorllHeight();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      [`tabList[${this.data.currentTab}].list`]: [],
      [`tabList[${this.data.currentTab}].query.page`]: 1,
      [`tabList[${this.data.currentTab}].scrollFlag`]: true
    })
    this.getCurrentTabList()
  },
  // tab被点击
  tabSelect(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      currentTab: index
    })
    if (!this.data.tabList[index].isInit) {
      this.setData({
        [`tabList[${this.data.currentTab}].isInit`]: true
      })
      this.getCurrentTabList()
    }
  },
  // 获取当前tab的内容列表
  getCurrentTabList() {
    if (this.data.tabList[this.data.currentTab].scrollFlag) {
      this.setData({
        [`tabList[${this.data.currentTab}].query.circle`]: this.data.circleId,
        [`tabList[${this.data.currentTab}].isLoading`]: true
      })
      getCircleReviewList({ data: this.data.tabList[this.data.currentTab].query }).then(res => {
        if (res.list.length > 0) {
          this.setData({
            [`tabList[${this.data.currentTab}].list`]: this.data.tabList[this.data.currentTab].list.concat(res.list)
          })
        } else {  // 数据加载完毕，不能再拉取下一页数据了
          this.setData({
            [`tabList[${this.data.currentTab}].scrollFlag`]: false  // 不允许再滚动获取数据 
          })
        }
        this.setData({
          [`tabList[${this.data.currentTab}].isLoading`]: false
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
        this.setData({
          [`tabList[${this.data.currentTab}].isLoading`]: false
        })
      })
    }
  },
  // 设置列表栏的高度
  setScorllHeight () {
    try {
      const res = wx.getSystemInfoSync()
      this.setData({
        scrollHeight: res.windowHeight - 60 - 45
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  // 滚动条触底
  onScrolltolower () {
    this.setData({
      [`tabList[${this.data.currentTab}].query.page`]: this.data.tabList[this.data.currentTab].query.page + 1
    })
    this.getCurrentTabList()
  },
  // 同意加入圈子
  agree(e) {
    const { item } = e.currentTarget.dataset
    const message = {
      content: `您申请加入的圈子“${item.circleInfo.name}”管理员已同意加入，快去看看吧`,
      send: this.data.userInfo._id,
      receive: item.user,
      type: 'system',
      status: 0
    }
    crudUpdate({ resource: 'circle_users', id: item._id, data: { status: 1 } }).then(res => {
      return crudAdd({ resource: 'messages', data: message })
    }).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      this.onPullDownRefresh()
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 移除这个圈子
  getOut(e) {
    const { item } = e.currentTarget.dataset
    const message = {
      content: `您已被管理员从圈子“${item.circleInfo.name}”中移除`,
      send: this.data.userInfo._id,
      receive: item.user,
      type: 'system',
      status: 0
    }
    crudDelete({ resource: 'circle_users', id: item._id }).then(res => {
      return crudAdd({ resource: 'messages', data: message })
    }).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      this.onPullDownRefresh()
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  }
})