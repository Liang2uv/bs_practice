import { crudListByFilter } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isPullDownRefresh: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    systemList: [],
    systemRed: 0,
    warningList: [],
    warningRed: 0,
    commentList: [],
    commentRed: 0,
    oldIsPullDownRefresh: false
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
      // 获取系统消息
      this.getSystemList()
      // 获取预警消息
      this.getWarningList()
      // 获取评论与回复消息
      this.getCommentList()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新的方法
    refresh() {
      this.getSystemList()
      this.getWarningList()
      this.getCommentList()
    },
    // 获取系统消息
    getSystemList() {
      const params = {
        resource: 'messages',
        data: { 
          receive: this.data.userInfo._id, 
          type: 'system'
        }
      }
      crudListByFilter(params).then(res => {
        this.setData({
          systemList: res,
          systemRed: res.filter(v => v.status === 0).length
        })
      })
    },
    // 获取预警消息
    getWarningList() {
      const params = {
        resource: 'messages',
        data: { 
          receive: this.data.userInfo._id, 
          type: 'warning'
        }
      }
      crudListByFilter(params).then(res => {
        this.setData({
          warningList: res,
          warningRed: res.filter(v => v.status === 0).length
        })
      })
    },
    // 获取评论与回复消息
    getCommentList() {
      const params = {
        resource: 'messages',
        data: { 
          receive: this.data.userInfo._id, 
          type: 'comment'
        }
      }
      crudListByFilter(params).then(res => {
        this.setData({
          commentList: res,
          commentRed: res.filter(v => v.status === 0).length
        })
      })
    },
    // 前往消息详情页
    toMessageDetail(e) {
      const { title, type } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/messageDetail/index?title=${title}&type=${type}`,
      })
    }
  }
})
