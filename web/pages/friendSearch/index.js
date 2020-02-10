import {
  crudListByFilter
} from '../../api/crud'
import { addFriend } from '../../api/friend'
import { getGlobalData } from '../../utils/util'
import { $wuxDialog } from '../../components/wux-weapp/index'
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
        resource: 'admin_users',
        data: {
          phone: `^${this.data.search}$`
        }
      }).then(res => {
        this.setData({
          list: res
        })
      })
    }
  },
  // 申请添加
  addFriend(e) {
    const { id } = e.currentTarget.dataset
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '附带消息',
      content: '',
      defaultText: '',
      maxlength: '300',
      placeholder: '请输入附带消息（可空）',
      onConfirm: (e, value) => {
        addFriend({ data: { toUser: id, remark: value } }).then(res => {
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
  }
})