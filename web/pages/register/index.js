import { assert } from '../../utils/util'
import { addUser } from '../../api/adminUser'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: {
      phone: '',
      password: '',
      role: 'officer',
      username: '',
      code: '',
      status: 1
    },
    roleName: '实习单位负责人',
    pickerVisible: false,
    roleOptions: [{
      title: '学生',
      value: 'student',
    },{
      title: '教师',
      value: 'teacher',
    },{
      title: '实习单位负责人',
      value: 'officer',
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取验证码，这里模拟返回并填充
  getCode() {
    // 随机产生6位数
    this.setData({
      ['model.code']: new Date().getTime() % 1000000
    })
  },
  // 表单提交
  formSubmit(e) {
    const { value } = e.detail
    this.setData({
      ['model.phone']: value.phone,
      ['model.password']: value.password,
      ['model.username']: value.username,
      ['model.code']: value.code
    })
    try {
      this.formValidate()
      addUser({ data: this.data.model }).then(res => {
        wx.showToast({
          title: '注册成功',
          icon: 'none'
        })
        wx.navigateTo({
          url: '/pages/login/index?title=登录',
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    }
  },
  // 数据校验
  formValidate() {
    assert(this.data.model.phone && this.data.model.phone !== '', '请填写正确的手机号码')
    assert(this.data.model.username && this.data.model.username !== '', '请填写用户名')
    assert(this.data.model.password && this.data.model.password.length > 0 && this.data.model.password.length <= 12, '请填写密码')
    assert(this.data.model.role, '请选择角色')
  }
})