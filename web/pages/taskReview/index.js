import { getGlobalData } from '../../utils/util'
import { getDateIn } from '../../utils/date'
import { crudListByFilterAndRefsPaging, crudUpdate, crudAdd } from '../../api/crud'
import { $wuxDialog } from '../../components/wux-weapp/index'
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
        teacher: '',
        refs: 'mainPlanInfo|applicantInfo',
        status: 0,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 1,
      text: '审核未通过',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      list: [],
      query: {
        teacher: '',
        refs: 'mainPlanInfo|applicantInfo',
        status: 1,
        page: 1,
        size: 30
      },
    },{
      id: 2,
      text: '未开始',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      query: {
        teacher: '',
        refs: 'mainPlanInfo|applicantInfo',
        status: 2,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 3,
      text: '进行中',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      query: {
        teacher: '',
        refs: 'mainPlanInfo|applicantInfo',
        status: 3,
        page: 1,
        size: 30
      },
      list: []
    },{
      id: 4,
      text: '已结束',
      isInit: false,
      scrollFlag: true,
      isLoading: false,
      query: {
        teacher: '',
        refs: 'mainPlanInfo|applicantInfo',
        status: 4,
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
    // 获取实习任务列表
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
        [`tabList[${this.data.currentTab}].query.teacher`]: this.data.userInfo._id,
        [`tabList[${this.data.currentTab}].isLoading`]: true
      })
      const params = {
        resource: 'tasks',
        data: this.data.tabList[this.data.currentTab].query
      }
      crudListByFilterAndRefsPaging(params).then(res => {
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
    let status = 1  // 默认是未通过
    if (index === 1) {  // 点击通过的操作
      const ret = getDateIn(new Date() ,[item.startAt, item.endAt])
      switch (ret) {
        case 0:
          status = 2
          break
        case 1:
          status = 3
        break
        case 2:
          status = 4
        break
      }
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
          content: `实习任务“${ item.name }”审核${status === 1 ? '未' : ''}通过${ value ? ':' + value : ''}`,
          send: this.data.userInfo._id,
          receive: item.applicant,
          type: 'system',
          status: 0
        }
        crudUpdate({ resource: 'tasks', id: item._id, data: { status } }).then(res => {
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
  // 前往实习详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/taskEdit/index?id=' + e.currentTarget.dataset.id,
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