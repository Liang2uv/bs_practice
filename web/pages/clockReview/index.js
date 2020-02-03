import { getGlobalData } from '../../utils/util'
import { crudAdd } from '../../api/crud'
import { $wuxDialog } from '../../components/wux-weapp/index'
import { getDayRecordList } from '../../api/dayRecord'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabList: [{
      id: 0,
      text: '待签到',
      isInit: true,
      scrollFlag: true,
      isLoading: false,
      query: {
        teaId: '',
        status: 0,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 1,
      text: '已签到',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      list: [],
      query: {
        teaId: '',
        status: 1,
        page: 1,
        size: 30
      },
    },{
      id: 2,
      text: '已请假',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      query: {
        teaId: '',
        status: 2,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 3,
      text: '缺勤',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      query: {
        teaId: '',
        status: 3,
        page: 1,
        size: 30
      },
      list: []
    }],
    userInfo: {},
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
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
        [`tabList[${this.data.currentTab}].query.teaId`]: this.data.userInfo._id,
        [`tabList[${this.data.currentTab}].isLoading`]: true
      })
      getDayRecordList({ data: this.data.tabList[this.data.currentTab].query }).then(res => {
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
})