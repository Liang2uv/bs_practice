import { getGlobalData } from '../../utils/util'
import { crudUpdate } from '../../api/crud'
import { $wuxDialog } from '../../components/wux-weapp/index'
import { getNoteList } from '../../api/note'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '实习记录审核',
    currentTab: 0,
    tabList: [{
      id: 0,
      text: '待审核',
      isInit: true,
      scrollFlag: true,
      isLoading: false,
      query: {
        teaId: '',
        type: 'day',
        status: 0,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 1,
      text: '已审核',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      query: {
        teaId: '',
        type: 'day',
        status: 1,
        page: 1,
        size: 30
      },
      list: []
    }],
    userInfo: {},
    actions: [{
      type: 'primary',
      text: '评分',
    }],
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {},
      title: options.title,
      [`tabList[0].query.type`]: options.type,
      [`tabList[1].query.type`]: options.type
    })
    // 获取实习记录列表
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
      getNoteList({ data: this.data.tabList[this.data.currentTab].query }).then(res => {
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
  // 评分操作
  mark(e) {
    const { item } = e.currentTarget.dataset
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '请打分',
      content: '',
      fieldtype: 'number',
      defaultText: '',
      maxlength: 1,
      placeholder: '请在0-5打分（如：5）',
      onConfirm: (e, value) => {
        const score = parseInt(value)
        if (isNaN(score) || score < 0 || score > 5) {
          wx.showToast({
            title: '分数不合法',
            icon: 'none'
          })
        } else {
          crudUpdate({ resource: 'notes', id: item._id, data: { status: 1, score } }).then(res => {
            wx.showToast({
              title: '操作成功',
              icon: 'none'
            })
          }).catch(err => {
            wx.showToast({
              title: err.message,
              icon: 'none'
            })
          })
        }
      }
    })
  },
  // 前往详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/noteDetail/index?id=' + e.currentTarget.dataset.id,
    })
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