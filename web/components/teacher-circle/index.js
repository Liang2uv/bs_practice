import {
  getCircleJoinList
} from '../../api/circle'
import {
  getGlobalData
} from '../../utils/util'
import {
  crudListByFilterAndRefsPaging
} from '../../api/crud'
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
    circleList: [],
    currentTab: 0,
    userInfo: {},
    circleQuery: {
      name: '',
      page: 1,
      size: 50
    },
    topicListArr: [
      []
    ],
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
      // 获取圈子列表
      this.getCircleList()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新的方法
    refresh() {
      this.setData({
        [`topicListArr[${this.data.currentTab}]`]: []
      })
      this.getCircleList()
    },
    // 获取加入的圈子列表
    getCircleList() {
      const data = {
        userId: this.data.userInfo._id,
        ...this.data.circleQuery
      }
      getCircleJoinList({
        data
      }).then(res => {
        this.setData({
          circleList: res.list
        })
        this.getCurrentTopicList()
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'nonw'
        })
      })
    },
    // 获取帖子列表
    getCurrentTopicList() {
      const index = this.data.currentTab
      const currentCircleId = this.data.circleList[index]._id
      const params = {
        resource: 'circle_topics',
        data: {
          circle: currentCircleId,
          refs: 'userInfo|topicInfo',
          page: 1,
          size: 50
        }
      }
      crudListByFilterAndRefsPaging(params).then(res => {
        if (res.list.length !== 0) {
          this.setData({
            [`topicListArr[${index}]`]: this.data.topicListArr[index].concat(res.list)
          })
        }
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    },
    // tab被点击
    tabSelect(e) {
      const {
        index
      } = e.currentTarget.dataset
      this.setData({
        currentTab: index
      })
      if (!this.data.topicListArr[index]) {
        this.data.topicListArr[index] = []
        this.getCurrentTopicList()
      }
    },
    // 查看图片
    viewImage(e) {
      const { imgs, url } = e.currentTarget.dataset
      wx.previewImage({
        urls: imgs,
        current: url
      });
    },
    // 前往帖子详情页
    toDetail(e) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo({
        url: '/pages/topicDetail/index?id=' + id,
      })
    },
    // 前往进圈审核页面
    circleReview(e) {
      wx.navigateTo({
        url: '/pages/circleReview/index?id=' + this.data.circleList[this.data.currentTab]._id,
      })
    },
    // 前往圈子信息编辑页面
    circleEdit(e) {
      wx.navigateTo({
        url: '/pages/circleEdit/index?id=' + this.data.circleList[this.data.currentTab]._id,
      })
    },
    // 前往我的帖子
    toMyTopic() {
      wx.navigateTo({
        url: '/pages/myTopic/index?circle=' + this.data.circleList[this.data.currentTab]._id,
      })
    }
  }
})