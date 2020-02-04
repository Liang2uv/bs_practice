import { getCommentList, addComment } from '../../api/comment'
import { crudUpdate } from '../../api/crud'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    topicId: null,
    topicInfo: null,
    placeholder: '说点什么...',
    comment: [],
    content: '',
    pid: '',
    layer: '1',
    toUserInfo: {},
    isAddViews: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topicId: options.id || null,
      userInfo: getGlobalData('userInfo') || {}
    })
    // 获取评论列表
    this.getCommentList()
  },
  // 获取评论列表
  getCommentList() {
    getCommentList({ data: { topic: this.data.topicId } }).then(res => {
      this.setData({
        topicInfo: res.topic || null,
        comment: res.comment || [],
        toUserInfo: res.topic.userInfo
      })
      if (!this.data.isAddViews) {
        this.addViews()
        this.setData({
          isAddViews: true
        })
      }
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 浏览数+1
  addViews() {
    const params = {
      resource: 'topics',
      id: this.data.topicId,
      data: { views: this.data.topicInfo.views ? this.data.topicInfo.views + 1 : 1 }
    }
    crudUpdate(params)
  },
  // 查看图片
  viewImage(e) {
    const { imgs, url } = e.currentTarget.dataset
    wx.previewImage({
      urls: imgs,
      current: url
    });
  },
  // 输入对话框改变
  inputChange(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 改变评论对象
  changeToUser(e) {
    const { layer, touserinfo, pid } = e.currentTarget.dataset
    this.setData({
      placeholder: `回复${touserinfo.username}：`,
      toUserInfo: touserinfo,
      layer,
      pid,
      content: ''
    })
  },
  // 添加评论
  addComment() {
    const data = {
      topic: this.data.topicId,
      content: this.data.content,
      layer: this.data.layer,
      pid: this.data.pid,
      fromUser: this.data.userInfo._id,
      toUser: this.data.toUserInfo._id
    }
    if (data.layer === '1') {
      delete data.pid
    }
    addComment({ data }).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      this.setData({
        content: ''
      })
      this.getCommentList()
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.getCommentList()
  }
})