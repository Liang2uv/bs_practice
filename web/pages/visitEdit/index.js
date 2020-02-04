import { crudOneByIdAndRefs, crudListByFilter, crudAdd } from '../../api/crud'
import { addNote } from '../../api/note'
import { getGlobalData, assert, dateFormat } from '../../utils/util'
import { uploadImage } from '../../utils/file'
import { $wuxToast } from '../../components/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    datePickerShow: false,
    isEdit: true,
    model: {
      content: '',
      imgs: [],
      teacher: '',
      student: [],
      students: [],
      date: ''
    },
    visitId: null,
    search: false,
    studentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    if (id) { // 非编辑，只做浏览
      this.setData({
        isEdit: false,
        visitId: id
      })
      this.getDetail()
    } else { // 编辑添加
      this.setData({
        ['model.date']: new Date().getTime(),
        ['model.teacher']: this.data.userInfo._id
      })
    }
  },
  // 获取详情信息
  getDetail() {
    const params = {
      id: this.data.visitId,
      resource: 'visits',
      data: {
        refs: 'student'
      }
    }
    crudOneByIdAndRefs(params).then(res => {
      res.students = res.student.map(v => v.username)
      this.setData({
        model: res
      })
      console.log(this.data.model)
    }, err => {
      $wuxToast().show({
        type: 'cancel',
        text: err.message,
        success: () => wx.navigateBack()
      })
    })
  },
  // 输入框选择状态改变
  inputChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      ['model.' + key]: e.detail.value
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
    uploadImage().then(res => {
      const imgs = this.data.model.imgs
      imgs.push(res.url)
      this.setData({
        ['model.imgs']: imgs
      })
    }, err => {
      $wuxToast().show({
        type: 'cancel',
        text: err.message
      })
    })
  },
  // 查看图片
  viewImage(e) {
    const { imgurl } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.model.imgs,
      current: imgurl
    });
  },
  // 删除图片
  delImg(e) {
    const { index } = e.currentTarget.dataset
    const imgs = this.data.model.imgs
    imgs.splice(index, 1)
    this.setData({
      [`model.imgs`]: imgs
    })
  },
  // 删除学生
  delStudent(e) {
    const { index } = e.currentTarget.dataset
    const newStudents = this.data.model.students
    newStudents.splice(index, 1)
    const newStudent = this.data.model.student
    newStudent.splice(index, 1)
    this.setData({
      ['model.students']: newStudents,
      ['model.student']: newStudent
    })
  },
  // 添加学生
  addStudent() {
    this.setData({
      search: true
    })
  },
  // 搜索学生
  searchStudent(e) {
    const { value } = e.detail
    if (value && value !== '') {
      crudListByFilter({ resource: 'admin_users', data: { username: value, role: 'student', school: this.data.userInfo.school } }).then(res => {
        this.setData({
          studentList: res
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    }
  },
  // 选择学生添加
  selectStudent(e) {
    const { item }  = e.currentTarget.dataset
    const ex = this.data.model.student.some(v => v._id === item._id)
    if (ex) {
      wx.showToast({
        title: '已存在，不可重复添加',
        icon: 'none'
      })
      return
    } else {
      this.setData({
        ['model.students']: this.data.model.students.concat([item.username]),
        ['model.student']: this.data.model.student.concat([item])
      })
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })
    }
  },
  // 取消搜索
  cancelSearch() {
    this.setData({
      search: false
    })
  },
  // 提交表单
  submit() {
    try {
      this.formValidate()
      const params = {
        content: this.data.model.content,
        imgs: this.data.model.imgs,
        student: this.data.model.student.map(v => v._id),
        date: dateFormat(this.data.model.date),
        teacher: this.data.model.teacher
      }
      crudAdd({ resource: 'visits', data: params }).then(() => {
        $wuxToast().show({
          text: '操作成功',
          success: () => wx.navigateBack()
        })
      }, err => {
        $wuxToast().show({
          text: err.message
        })
      })
    } catch (error) {
      $wuxToast().show({
        text: error.message
      })
    }
  },
  // 数据校验
  formValidate() {
    assert(this.data.model.content, '请填写走访记录内容')
    assert(this.data.model.date, '请选择日期')
    assert(this.data.model.student && this.data.model.student.length !== 0, '请选择走访学生')
  }
})