import { crudListByFilterAndRefs } from '../../api/crud'
import { getGlobalData, assert, dateCompare } from '../../utils/util'
import { MAP_KEY, MAP_REFERER } from '../../conf/map'
import Toast from '../../components/vantui/toast/toast'
import Dialog from '../../components/vantui/dialog/dialog';
import { getWorkDays, addTask } from '../../api/task'
const chooseLocation = requirePlugin('chooseLocation')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      mainPlan: '',
      mainPlanInfo: { name: '', times: 0 },
      teacher: '',
      teacherInfo: { name: '' },
      startAt: "",
      endAt: "",
      workType: '',
      workTime: ['', ''],
      workDays: 0,
      post: '',
      salary: 0,
      address: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    this.getMainPlanList()
  },
  /**
   * 生命周期函数--监听页面展示
   */
  onShow: function (options) {
    this.getLocation()
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
    const params = {}
    params['mainPlanPickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      const { value, index } = e.detail
      params['model.mainPlan'] = this.data._mainPlanList[index]._id
      params['model.mainPlanInfo.name'] = value
      params['model.mainPlanInfo.times'] = this.data._mainPlanList[index].times
      params['_teacherList'] = this.data._mainPlanList[index].teacher
      params['teacherList'] = this.data._mainPlanList[index].teacher.map(v => v.username)
    }
    this.setData(params)
  },
  // 指导老师选择框改变
  teacherPickerChange(e) {
    const params = {}
    params['teacherPickerShow'] = e.type === 'click'
    if (e.type === 'confirm') {
      const { value, index } = e.detail
      params['model.teacher'] = this.data._teacherList[index]._id
      params['model.teacherInfo.name'] = value
    }
    this.setData(params)
  },
  //休假类型选择框改变
  workTypePickerChange(e) {
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
  // 提交表单
  submit() {
    try {
      this.formValidate()
      getWorkDays({ data: { startAt: new Date(this.data.model.startAt), endAt: new Date(this.data.model.endAt), mainPlan: this.data.model.mainPlan } }).then(res => {
        Dialog.confirm({
          title: '是否继续提交',
          message: `有效实习天数为${res.workDays}天（除去双休与节假日），实习计划要求至少实习天数为${this.data.model.mainPlanInfo.times}天，是否继续?`,
          asyncClose: true
        }).then(() => {
          const params = {
            name: this.data.model.name,
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
            status: 0
          }
          addTask({ data: params }).then(res => {
            console.log(res)
            Dialog.close()
            wx.navigateBack()
          }, error => {
            Toast(error.message)
            Dialog.close()
          })
        }).catch(error => {
          Dialog.close()
        })
      })
    } catch (error) {
      Toast(error.message)
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
    assert(this.data.model.contactPhone, '请填写联系人电话')
  }
})