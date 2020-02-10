import {
  crudListByFilter
} from '../../api/crud'
import {
  getGlobalData
} from '../../utils/util'
import {
  $wuxDialog
} from '../../components/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resource: 'tasks',
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
    this.getList()
  },
  onShow() {
    this.getList()
  },
  // 获取列表
  getList() {
    const params = {
      resource: this.data.resource,
      data: {
        applicant: this.data.userInfo._id
      }
    }
    crudListByFilter(params).then(res => {
      this.setData({
        list: res.map(v => {
          switch (v.status) {
            case 0:
              v.statusName = '审核中';
              v.statusColor = 'grey';
              break;
            case 1:
              v.statusName = '审核未通过';
              v.statusColor = 'red';
              break;
            case 2:
              v.statusName = '未开始';
              v.statusColor = 'blue';
              break;
            case 3:
              v.statusName = '进行中';
              v.statusColor = 'green';
              break;
            case 4:
              v.statusName = '已完成';
              v.statusColor = 'yellow';
              break;
          }
          return v
        })
      })
    })
  },
  // 前往详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/taskEdit/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 前往签到列表
  toClockList(e) {
    const {
      task
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/clockList/index?task=' + task
    })
  },
  // 选择实习手册类型
  selectNote(e) {
    const {
      task,
      taskname
    } = e.currentTarget.dataset
    $wuxDialog().open({
      resetOnClose: true,
      content: '选择手册类型',
      verticalButtons: !0,
      buttons: [{
          text: '实习日记',
          bold: !0,
          onTap: () => {
            wx.navigateTo({
              url: '/pages/note/index?type=day&title=实习日记&taskName='+ taskname +'&task=' + task,
            })
          },
        },
        {
          text: '实习周记',
          bold: !0,
          onTap: () => {
            wx.navigateTo({
              url: '/pages/note/index?type=week&title=实习周记&taskName='+ taskname +'&task=' + task,
            })
          },
        },
        {
          text: '实习月记',
          bold: !0,
          onTap: () => {
            wx.navigateTo({
              url: '/pages/note/index?type=month&title=实习月记&taskName='+ taskname +'&task=' + task,
            })
          },
        },
        {
          text: '实习总结',
          bold: !0,
          onTap: () => {
            wx.navigateTo({
              url: '/pages/note/index?type=summary&title=实习总结&taskName='+ taskname +'&task=' + task,
            })
          },
        }
      ]
    })
  },
  // 前往请假记录列表
  toDayOffList(e) {
    const {
      task
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/dayOff/index?task=' + task
    })
  },
  // 前往评价列表
  toRate(e) {
    const {
      task
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/rate/index?task=' + task,
    })
  }
})