import {
  crudOneByIdAndRefs,
  crudListByFilter
} from '../../api/crud'
import { getCircleJoinList } from '../../api/circle'
import { addNote } from '../../api/note'
import {
  getGlobalData,
  assert,
  dateFormat
} from '../../utils/util'
import {
  uploadImage
} from '../../utils/file'
import {
  $wuxToast
} from '../../components/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    datePickerShow: false,
    taskPickerShow: false,
    taskList: [],
    _taskList: [],
    title: '发布',
    isEdit: true,
    minTextLength: 200,
    maxTextLength: 800,
    model: {
      content: '',
      imgs: [],
      task: '',
      taskInfo: {
        name: ''
      },
      student: '',
      tags: [],
      score: 0,
      date: '',
      type: 'day',
      status: 0
    },
    noteId: null,
    circlesDisplay: '',
    circlesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      title,
      type,
      id
    } = options
    const currentTask = getGlobalData('currentTask')
    this.setData({
      title: title,
      userInfo: getGlobalData('userInfo') || {}
    })
    if (id) { // 非编辑，只做浏览
      this.setData({
        isEdit: false,
        noteId: id
      })
      this.getDetail()
    } else { // 编辑添加
      this.setData({
        ['model.date']: new Date().getTime(),
        ['model.type']: type,
        ['model.task']: currentTask ? currentTask._id : '',
        ['model.taskInfo']: currentTask || {
          name: ''
        }
      })
      // 获取实习任务列表
      this.getTaskList()
      // 获取圈子列表
      this.getCircleList()
    }
  },
  // 获取详情信息
  getDetail() {
    const params = {
      id: this.data.noteId,
      resource: 'notes',
      data: {
        refs: 'taskInfo'
      }
    }
    crudOneByIdAndRefs(params).then(res => {
      this.setData({
        model: res
      })
    }, err => {
      $wuxToast().show({
        type: 'cancel',
        text: err.message,
        success: () => wx.navigateBack()
      })
    })
  },
  // 获取实习任务列表
  getTaskList() {
    const params = {
      resource: 'tasks',
      data: {
        applicant: this.data.userInfo._id
      }
    }
    crudListByFilter(params).then(res => {
      this.setData({
        taskList: res.map(v => v.name),
        _taskList: res
      })
    })
  },
  // 获取圈子列表
  getCircleList() {
    const data = {
      userId: this.data.userInfo._id,
      name: '',
      page: 1,
      size: 50
    }
    getCircleJoinList({ data }).then(res => {
      this.setData({
        circlesList: res.list.map(v => ({ title: v.name, value: v._id }))
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'nonw'
      })
    })
  },
  // 同步的圈子选择器发生改变
  circlesPickerChange(e) {
    this.setData({
      ['model.circles']: e.detail.value,
      circlesDisplay: e.detail.label
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
  // 所属任务选择器改变
  taskPickerChange(e) {
    if (!this.data.isEdit) {
      return
    }
    const params = {}
    params['taskPickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      const {
        index
      } = e.detail
      params['model.task'] = this.data._taskList[index]._id
      params['model.taskInfo'] = this.data._taskList[index]
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
    const {
      imgurl
    } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.model.imgs,
      current: imgurl
    });
  },
  // 删除图片
  delImg(e) {
    const {
      index
    } = e.currentTarget.dataset
    const imgs = this.data.model.imgs
    imgs.splice(index, 1)
    this.setData({
      [`model.imgs`]: imgs
    })
  },
  // 提交表单
  submit() {
    try {
      this.formValidate()
      this.setTags()
      const params = {
        content: this.data.model.content,
        imgs: this.data.model.imgs,
        task: this.data.model.task,
        student: this.data.userInfo._id,
        date: dateFormat(this.data.model.date),
        tags: this.data.model.tags,
        score: this.data.model.score,
        type: this.data.model.type,
        status: this.data.model.status,
        circles: this.data.model.circles
      }
      addNote({
        data: params
      }).then(res => {
        $wuxToast().show({
          text: '发布成功',
          success: () => wx.navigateBack()
        })
      }, error => {
        $wuxToast().show({
          type: 'cancel',
          text: error.message
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
    assert(this.data.model.content, '请填写内容')
    assert(this.data.model.content.length >= this.data.minTextLength, `内容字数不能少于${this.data.minTextLength}字`)
    assert(this.data.model.content.length <= this.data.maxTextLength, `内容字数不能超过${this.data.maxTextLength}字`)
    assert(this.data.model.date, '请选择日期')
    assert(this.data.model.task, '请选择关联任务')
  },
  // 设置标签
  setTags() {
    let tag = '实习日记'
    switch (this.data.model.type) {
      case 'day':
        tag = '实习日记'
        break
      case 'week':
        tag = '实习周记'
        break
      case 'month':
        tag = '实习月记'
        break
      case 'summary':
        tag = '实习总结'
        break
    }
    this.setData({
      ['model.tags']: [tag]
    })
  }
})