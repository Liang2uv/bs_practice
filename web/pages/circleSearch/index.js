import {
  crudListByFilter
} from '../../api/crud'
import { joinCircle } from '../../api/circleUser'
import { getGlobalData } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    list: [],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    const search = options.search
    if (search) {
      this.setData({
        search
      })
      this.searchList()
    }
  },
  // 搜索按钮点击
  searchClick(e) {
    const {
      search
    } = e.detail.value
    this.setData({
      search
    })
    this.searchList()
  },
  // 搜索列表
  searchList() {
    if (this.data.search) {
      crudListByFilter({
        resource: 'circles',
        data: {
          name: this.data.search,
          status: 1
        }
      }).then(res => {
        this.setData({
          list: res
        })
      })
    }
  },
  // 申请加入圈子
  joinCircle(e) {
    const { id } = e.currentTarget.dataset
    joinCircle({ data: { user: this.data.userInfo._id, circle: id } }).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  }
})