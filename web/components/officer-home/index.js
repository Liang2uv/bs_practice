import { getGlobalData } from '../../utils/util'
import { crudListByFilterAndRefsPaging } from '../../api/crud'
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
    currentTab: 0,
    tabList: [{
      id: 0,
      text: '待评价',
      isInit: true,
      scrollFlag: true,
      isLoading: false,
      query: {
        rater: '',
        status: 0,
        refs: 'taskInfo|raterInfo|studentInfo',
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 1,
      text: '已评价',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      list: [],
      query: {
        rater: '',
        status: 1,
        refs: 'taskInfo|raterInfo|studentInfo',
        page: 1,
        size: 30
      },
    }],
    userInfo: {},
    scrollHeight: 0
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
      // 获取列表
      this.getCurrentTabList()
      // 设置列表栏的高度
      this.setScorllHeight()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新的方法
    refresh() {
      this.setData({
        [`tabList[${this.data.currentTab}].list`]: [],
        [`tabList[${this.data.currentTab}].query.page`]: 1,
        [`tabList[${this.data.currentTab}].scrollFlag`]: true
      })
      // 获取实习考评列表
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
    // 获取实习考评列表
    getCurrentTabList() {
      if (this.data.tabList[this.data.currentTab].scrollFlag) {
        this.setData({
          [`tabList[${this.data.currentTab}].query.rater`]: this.data.userInfo._id,
          [`tabList[${this.data.currentTab}].isLoading`]: true
        })
        crudListByFilterAndRefsPaging({ resource: 'rates', data: this.data.tabList[this.data.currentTab].query }).then(res => {
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
    // 前往详情页
    toDetail(e) {
      wx.navigateTo({
        url: '/pages/rateEdit/index?id=' + e.currentTarget.dataset.id,
      })
    }
  }
})
