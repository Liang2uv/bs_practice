import { getGlobalData } from '../../utils/util'
import { getDateIn } from '../../utils/date'
import { crudListByFilterAndRefsPaging, crudUpdate, crudAdd } from '../../api/crud'
import { $wuxDialog } from '../../components/wux-weapp/index'
import { getDayOffList, updateDayOff } from '../../api/dayOff'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabList: [{
      id: 0,
      text: '未审核',
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
      text: '已通过',
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
      text: '不通过',
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
    }],
    userInfo: {},
    actions: [{
      type: 'default',
      text: '驳回',
    }, {
      type: 'primary',
      text: '通过',
    }],
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    // 获取请假申请列表
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
      getDayOffList({ data: this.data.tabList[this.data.currentTab].query }).then(res => {
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
  // 审核操作
  review(e) {
    const { index } = e.detail
    const { item } = e.currentTarget.dataset
    let status = 2  // 默认是未通过
    if (index === 1) {  // 点击通过的操作
      status = 1
    }
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '确认消息',
      content: '',
      defaultText: '',
      maxlength: '300',
      placeholder: '请输入理由（可空）',
      onConfirm: (e, value) => {
        const message = {
          content: `您的请假申请审核${status === 2 ? '未' : ''}通过${ value ? ':' + value : ''}`,
          send: this.data.userInfo._id,
          receive: item.student,
          type: 'system',
          status: 0
        }
        updateDayOff({ id: item._id, data: { status } }).then(res => {
          return crudAdd({ resource: 'messages', data: message })
        }).then(res => {
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
    })
  },
  // 前往详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/dayOffEdit/index?id=' + e.currentTarget.dataset.id,
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