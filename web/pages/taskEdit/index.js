import { crudListByFilterAndRefs, crudOneByIdAndRefs } from '../../api/crud'
import { getGlobalData, assert, dateCompare } from '../../utils/util'
import { downloadFile, uploadImage } from '../../utils/file'
import { getNowZero } from '../../utils/date'
import { MAP_KEY, MAP_REFERER } from '../../conf/map'
import { $wuxToast, $wuxDialog } from '../../components/wux-weapp/index'
import { getWorkDays, addTask } from '../../api/task'
const chooseLocation = requirePlugin('chooseLocation')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '新建任务',
    userInfo: {},
    mainPlanList: [],
    _mainPlanList: [],
    teacherList: [],
    _teacherList: [],
    workTypeList: ['双休', '单休', '大小周'],
    _workTypeList: ['double', 'single', 'turns'],
    mainPlanPickerShow: false,
    teacherPickerShow: false,
    startAtPickerShow: false,
    endAtPickerShow: false,
    workTypePickerShow: false,
    workTypeName: '',
    workTime0PickerShow: false,
    workTime1PickerShow: false,
    model: {
      name: '',
      company: '',
      mainPlan: '',
      mainPlanInfo: { name: '', times: 0 },
      teacher: '',
      teacherInfo: { username: '' },
      startAt: getNowZero(),
      endAt: getNowZero(),
      workType: '',
      workTime: ['', ''],
      workDays: 0,
      post: '',
      salary: 0,
      address: {},
      files: []
    },
    isEdit: true,
    taskId: null
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
        title: '任务详情',
        isEdit: false,
        taskId: options.id
      })
      // 获取实习任务详情信息
      this.getTaskDetail()
    } else {  // 编辑状态
      // 获取实习计划列表
      this.getMainPlanList()
    }
  },
  /**
   * 生命周期函数--监听页面展示
   */
  onShow: function (options) {
    this.getLocation()
  },
  // 获取实习任务详情信息
  getTaskDetail() {
    const params = { id: this.data.taskId, resource: 'tasks', data: { refs: 'mainPlanInfo|teacherInfo' } }
    crudOneByIdAndRefs(params).then(res => {
      this.setData({
        model: res,
        workTypeName: {double:'双休',single:'单休',turns:'大小周'}[res.workType]
      })
    }, err => {
      $wuxToast().show({ type: 'cancel', text: err.message, success: wx.navigateBack() })
    })
  },
  // 获取实习计划列表
  getMainPlanList() {
    const params = { resource: 'main_plans', data: { school: this.data.userInfo.school, refs: 'teacher' } }
    crudListByFilterAndRefs(params).then(res => {
      this.setData({
        mainPlanList: res.map(v => v.name),
        _mainPlanList: res
      })
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
  // 实习计划选择框状态改变
  mainPlanPickerChange(e) {
    if (!this.data.isEdit) {
      return
    }
    const params = {}
    params['mainPlanPickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      const { index } = e.detail
      params['model.mainPlan'] = this.data._mainPlanList[index]._id
      params['model.mainPlanInfo'] = this.data._mainPlanList[index]
      params['model.files'] = this.data._mainPlanList[index].files.map(v => ({name: v.name, imgs: []})),
      params['_teacherList'] = this.data._mainPlanList[index].teacher
      params['teacherList'] = this.data._mainPlanList[index].teacher.map(v => v.username)
    }
    this.setData(params)
  },
  // 指导老师选择框改变
  teacherPickerChange(e) {
    if (!this.data.isEdit) {
      return
    }
    const params = {}
    params['teacherPickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      const { value, index } = e.detail
      params['model.teacher'] = this.data._teacherList[index]._id
      params['model.teacherInfo.username'] = value
    }
    this.setData(params)
  },
  //休假类型选择框改变
  workTypePickerChange(e) {
    if (!this.data.isEdit) {
      return
    }
    const params = {}
    params['workTypePickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      const { value, index } = e.detail
      params['model.workType'] = this.data._workTypeList[index]
      params['workTypeName'] = value
    }
    this.setData(params)
  },
  // 上下班时间选择框改变
  workTimePickerChange(e) {
    if (!this.data.isEdit) {
      return
    }
    const key = e.currentTarget.dataset.key
    const idx = key === 'workTime0' ? 0 : 1
    const params = {}
    params[key + 'PickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      params['model.workTime[' + idx + ']'] = e.detail
    }
    this.setData(params)
  },
  // 地图选点
  toSelectLocation() {
    if (!this.data.isEdit) {
      return
    }
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${MAP_KEY}&referer=${MAP_REFERER}`
    })
  },
  // 获取地图选取的地点
  getLocation() {
    const location = chooseLocation.getLocation();
    if (location) {
      this.setData({
        ['model.address.address']: location.address,
        ['model.address.city']: location.city,
        ['model.address.latitude']: location.latitude,
        ['model.address.longitude']: location.longitude,
        ['model.address.name']: location.name
      })
    }
  },
  // 下载模板
  downloadMoban(e) {
    const { fileurl, filename } = e.currentTarget.dataset
    downloadFile(fileurl, filename).then(res => {
      $wuxDialog().confirm({
        resetOnClose: true,
        content: '下载成功，是否打开文档',
        onConfirm: () => {
          wx.openDocument({
            filePath: res.filePath,
            fail: function (res) {
              $wuxToast().show({ type: 'cancel', text: '打开文档失败' })
            }
          })
        }
      })
    }, err => {
      $wuxToast().show({ type: 'cancel', text: err.message })
    })
  },
  // 选择图片上传
  chooseImage(e) {
    const { fileindex } = e.currentTarget.dataset
    uploadImage().then(res => {
      const imgs = this.data.model.files[fileindex].imgs
      imgs.push({ imgname: res.originalname, imgurl: res.url })
      this.setData({
        [`model.files[${fileindex}].imgs`]: imgs
      })
    }, err => {
      $wuxToast().show({ type: 'cancel', text: err.message })
    })
  },
  // 查看图片
  viewImage(e) {
    const { fileindex, imgurl } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.model.files[fileindex].imgs.map(v => v.imgurl),
      current: imgurl
    });
  },
  // 删除图片
  delImg(e) {
    const { fileindex, imgindex } = e.currentTarget.dataset
    const imgs = this.data.model.files[fileindex].imgs
    imgs.splice(imgindex, 1)
    this.setData({
      [`model.files[${fileindex}].imgs`]: imgs
    })
  },
  // 提交表单
  submit() {
    try {
      this.formValidate()
      getWorkDays({ data: { startAt: new Date(this.data.model.startAt), endAt: new Date(this.data.model.endAt), mainPlan: this.data.model.mainPlan } }).then(res => {
        $wuxDialog().confirm({
          resetOnClose: true,
          title: '是否继续提交',
          content: `有效实习天数为${res.workDays}天(除去双休与节假日)，实习计划要求至少实习天数为${this.data.model.mainPlanInfo.times}天，是否继续`,
          onConfirm: () => {
            const params = {
              name: this.data.model.name,
              company: this.data.model.company,
              mainPlan: this.data.model.mainPlan,
              startAt: new Date(this.data.model.startAt),
              endAt: new Date(this.data.model.endAt),
              workType: this.data.model.workType,
              workTime: this.data.model.workTime,
              workDays: res.workDays,
              post: this.data.model.post,
              salary: this.data.model.salary,
              address: this.data.model.address,
              contact: this.data.model.contact,
              contactPhone: this.data.model.contactPhone,
              teacher: this.data.model.teacher,
              applicant: this.data.userInfo._id,
              status: 0,
              files: this.data.model.files
            }
            addTask({ data: params }).then(res => {
              wx.navigateBack()
            }, error => {
              $wuxToast().show({ type: 'cancel', text: error.message })
            })
          }
        })
      })
    } catch (error) {
      $wuxToast().show({ text: error.message })
    }
  },
  // 数据校验
  formValidate() {
    assert(this.data.model.name, '请填写任务名称')
    assert(this.data.model.mainPlan, '请选择实习计划')
    assert(this.data.model.teacher, '请选择指导老师')
    assert(this.data.model.startAt, '请选择开始时间')
    assert(this.data.model.endAt, '请选择结束时间')
    assert(dateCompare(this.data.model.startAt, this.data.model.endAt), '开始时间不能大于结束时间')
    assert(this.data.model.workTime[0], '请选择上班时间')
    assert(this.data.model.workTime[1], '请选择下班时间')
    assert(this.data.model.address.name, '请选择实习地点')
    assert(this.data.model.workType, '请选择休假类型')
    assert(this.data.model.contact, '请填写实习联系人')
    assert(this.data.model.contactPhone && /^1[3-9]\d{9}$/.test(this.data.model.contactPhone), '请填写正确的联系人电话')
  }
})