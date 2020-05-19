import { updateUser } from '../../api/adminUser'
import { getGlobalData, assert } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pass: '',
    checkPass: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
  },
  // 表单提交
  formSubmit(e) {
    try {
      const { value } = e.detail
      assert(value.pass !== '' && value.checkPass !== '', '请填写完表单内容')
      assert(value.pass === value.checkPass, '两次输入密码不一致')
      const params = {
        id: this.data.userInfo._id,
        data: {
          password: value.pass
        }
      }
      updateUser(params).then(() => {
        wx.showToast({
          title: '修改密码成功',
          icon: 'none'
        })
        this.setData({
          pass: '',
          checkPass: ''
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }
})