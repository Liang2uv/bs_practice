import { crudAdd, crudOneByIdAndRefs } from '../../api/crud'
import { getGlobalData, assert, dateCompare, dateFormat } from '../../utils/util'
import { uploadImage } from '../../utils/file'
import { $wuxToast } from '../../components/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    startAtPickerShow: false,
    endAtPickerShow: false,
    model: {
      taskInfo: { name: '' },
      startAt: "",
      endAt: "",
      reason: '',
      files: []
    },
    isEdit: true,
    dayOffId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {},
      'model.taskInfo': getGlobalData('currentTask') || {}
    })
    if (options.id) { // 非编辑，只做浏览
      this.setData({
        isEdit: false,
        dayOffId: options.id
      })
      this.getDetail()
    }
  },
  // 获取请假详情信息
  getDetail() {
    const params = { id: this.data.dayOffId, resource: 'day_off', data: { refs: 'taskInfo|studentInfo' } }
    crudOneByIdAndRefs(params).then(res => {
      this.setData({
        model: res
      })
    }, err => {
      $wuxToast().show({ type: 'cancel', text: err.message, success: () => wx.navigateBack() })
    })
  },
  // 输入框选择状态改变
  inputChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      ['model.' + key]: e.detail
    })
  },
  // 时间选择器改变
  datetimePickerChange(e) {
    if (!this.data.isEdit) {
      return
    }
    const key = e.currentTarget.dataset.key
    const params = {}
    params[key + 'PickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      params['model.' + key] = e.detail
    }
    this.setData(params)
  },
  // 选择图片上传
  chooseImage(e) {
    const { index } = e.currentTarget.dataset
    uploadImage().then(res => {
      const files = this.data.model.files
      files.push({ filename: res.originalname, fileurl: res.url })
      this.setData({
        ['model.files']: files
      })
    }, err => {
      $wuxToast().show({ type: 'cancel', text: err.message })
    })
  },
  // 查看图片
  viewImage(e) {
    const { imgurl } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.model.files.map(v => v.fileurl),
      current: imgurl
    });
  },
  // 删除图片
  delImg(e) {
    const { index } = e.currentTarget.dataset
    const files = this.data.model.files
    files.splice(index, 1)
    this.setData({
      [`model.files`]: files
    })
  },
  // 提交表单
  submit() {
    try {
      this.formValidate()
      const params = {
        task: this.data.model.taskInfo._id,
        student: this.data.userInfo._id,
        startAt: dateFormat(this.data.model.startAt),
        endAt: dateFormat(this.data.model.endAt),
        reason: this.data.model.reason,
        status: 0,
        files: this.data.model.files
      }
      crudAdd({ resource: 'day_offs', data: params }).then(res => {
        $wuxToast().show({ text: '提交成功，请等待老师审核', success: () => wx.navigateBack() })
      }, error => {
        $wuxToast().show({ type: 'cancel', text: error.message })
      })
    } catch (error) {
      $wuxToast().show({ text: error.message })
    }
  },
  // 数据校验
  formValidate() {
    assert(this.data.model.startAt, '请选择开始时间')
    assert(this.data.model.endAt, '请选择结束时间')
    assert(dateCompare(this.data.model.startAt, this.data.model.endAt), '开始时间不能大于结束时间')
    assert(this.data.model.reason, '请填写申请理由')
  }
})