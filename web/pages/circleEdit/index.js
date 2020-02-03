import { crudAdd, crudOneByIdAndRefs, crudOneById, crudUpdate } from '../../api/crud'
import { getGlobalData, assert, dateCompare, dateFormat } from '../../utils/util'
import { uploadImage } from '../../utils/file'
import { addCircle } from '../../api/circle'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    model: {
      name: '',
      avatar: '',
      desc: '',
      enterWay: 0,
      creater: '',
      status: 1
    },
    isEdit: true,
    circleId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    if (options.id) { // 非编辑，只做浏览
      this.setData({
        isEdit: false,
        circleId: options.id
      })
      this.getDetail()
    }
  },
  // 获取详情信息
  getDetail() {
    const params = { id: this.data.circleId, resource: 'circles' }
    crudOneById(params).then(res => {
      this.setData({
        model: res
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
      wx.navigateBack()
    })
  },
  // 输入框选择状态改变
  inputChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      ['model.' + key]: e.detail
    })
  },
  // 单选选择框改变
  radioChange(e) {
    const { key } = e.currentTarget.dataset
    this.setData({
      [`model.${key}`]: e.detail.value
    })
  },
  // 选择图片上传
  chooseImage(e) {
    uploadImage().then(res => {
      this.setData({
        ['model.avatar']: res.url
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 查看图片
  viewImage(e) {
    wx.previewImage({
      urls: [this.data.model.avatar],
      current: this.data.model.avatar
    });
  },
  // 提交表单
  submit() {
    try {
      this.formValidate()
      const params = {
        avatar: this.data.model.avatar,
        creater: this.data.userInfo._id,
        desc: this.data.model.desc,
        enterWay: parseInt(this.data.model.enterWay),
        status: parseInt(this.data.model.status),
        name: this.data.model.name
      }
      if (!this.data.isEdit) { // 编辑
        crudUpdate({ resource: 'circles', id: this.data.circleId, data: params }).then(() => {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          wx.navigateBack()
        }, err => {
          wx.showToast({
            title: err.message,
            icon: 'none'
          })
        })
      } else {  // 添加
        addCircle({ data: params }).then(() => {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          wx.navigateBack()
        }, err => {
          wx.showToast({
            title: err.message,
            icon: 'none'
          })
        })
      }
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  },
  // 数据校验
  formValidate() {
    assert(this.data.model.name, '请填写名称')
    assert(this.data.model.avatar && this.data.model.avatar !== '', '请选择圈子头像')
    assert(this.data.model.enterWay, '请选择进圈方式')
    assert(this.data.model.status, '请选择圈子状态')
  }
})