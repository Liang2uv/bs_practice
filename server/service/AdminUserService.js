const BaseService = require('./BaseService')
const AdminUserModel = require('../model/AdminUser')
const OrganizationModel = require('../model/Organization')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const assert = require('http-assert')
const { JWT_SECRECT, WX_APPID, WX_SECRECT } = require('../conf/secrect')
const { EXPIRESIN } = require('../conf/variable')
const mongoose = require('mongoose')
const axios = require('axios')
const xlsx = require('node-xlsx')

class AdminUserService extends BaseService {
  constructor() {
    super(AdminUserModel)
  }
  /**
   * 后台登录
   * @param {String} phone 手机号
   * @param {String} password 密码
   */
  async login(phone, password) {
    assert(phone && password, 400, '请求参数错误')
    // 1. 根据用户名找用户
    const user = await this.model.findOne({ phone }).select('+password')
    assert(user, 422, '用户不存在')
    // 2. 校验密码
    const isValid = bcryptjs.compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // 3. 生成token
    const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: EXPIRESIN })
    // 4. 获取用户信息
    const userInfo = await this.model.findByIDAndRef(user._id, 'schoolInfo collegeInfo gradeInfo majorInfo classInfo')
    return { token, userInfo }
  }
  /**
   * 小程序端登录
   * @param {String} code 登录凭证
   */
  async wxLogin(code) {
    assert(code, 400, '请求参数错误')
    const wxApi = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRECT}&js_code=${code}&grant_type=authorization_code`
    const { data } = await axios.get(wxApi)
    assert(data && data.openid, 422, 'code无效，获取信息失败')
    const user = await this.model.findOne({ openid: data.openid })
    assert(user, 422, '未绑定手机号')
    const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: EXPIRESIN })
    const userInfo = await this.model.findByIDAndRef(user._id, 'schoolInfo collegeInfo gradeInfo majorInfo classInfo')
    return { token, userInfo }
  }
  /**
   * 绑定微信号
   * @param {String} phone
   * @param {String} password
   * @param {String} code
   */
  async wxBind(phone, password, code) {
    assert(phone && password && code, 400, '请求参数错误')
    // 1. 根据用户名找用户
    const user = await this.model.findOne({ phone }).select('+password')
    assert(user, 422, '用户不存在')
    // 2. 校验密码
    const isValid = bcryptjs.compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // 3. 从微信服务端获取openid
    const wxApi = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRECT}&js_code=${code}&grant_type=authorization_code`
    const { data } = await axios.get(wxApi)
    assert(data && data.openid, 422, 'code无效，获取信息失败')
    // 4. 将openid与账号一一对应，确保唯一
    await this.model.updateMany({ openid: data.openid }, { openid: '' })
    // 5. 将openid与账号绑定
    await this.model.updateObj(user._id, { openid: data.openid })
    // 6. 生成token
    const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: EXPIRESIN })
    // 7. 获取用户信息
    const userInfo = await this.model.findByIDAndRef(user._id, 'schoolInfo collegeInfo gradeInfo majorInfo classInfo')
    return { token, userInfo }
  }
  /**
   * 添加用户
   * @param {Object} model 添加的数据
   */
  async addUser(model) {
    const exist = await this.model.findOne({ phone: model.phone })
    assert(!exist, 422, '手机号已被注册')
    const user = await this.model.createObj(model)
    return await this.model.findByIDAndRef(user._id, 'schoolInfo collegeInfo gradeInfo majorInfo classInfo')
  }
  /**
   * 更新用户信息
   * @param {String} id 用户id
   * @param {Object} model 更新的数据
   */
  async updateUser(id, model) {
    const exist = await this.model.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, phone: model.phone })
    assert(!exist, 422, '手机号已被注册')
    const user = await this.model.updateObj(id, model)
    return await this.model.findByIDAndRef(user._id, 'schoolInfo collegeInfo gradeInfo majorInfo classInfo')
  }
  /**
   * 批量导入学生信息
   * @param {String} school 学校id
   * @param {String} file 文件对象
   */
  async importStudent(school, file) {
    const list = xlsx.parse(file.path);
    const insertModels = []
    const tableHeader = ['姓名', '学号', '手机号', '学院', '年级', '专业', '班级']
    if (list[0].data.length <= 1) {
      assert(false, 422, '请填写数据后导入')
    }
    for (let index = 0; index < list[0].data.length; index++) {
      if (index === 0) { // 表头
        if (list[0].data[index].join(',') !== tableHeader.join(',')) {
          assert(false, 422, '模板格式错误')
        }
      } else {  // 实际数据
        // 用户模型
        const model = {
          phone: list[0].data[index][2],
          password: '123456',
          username: list[0].data[index][0],
          role: 'student',
          number: list[0].data[index][1],
          school
        }
        // 数据校验
        if (list[0].data[index].length < tableHeader.length) {
          assert(false, 422, `第${index + 1}行用户数据不完整`)
        }
        const exist = await this.model.findOne({ phone: model.phone })
        assert(!exist, 422, `第${index + 1}行用户的手机号已被注册`)

        const collegeModel = await OrganizationModel.findOne({ name: list[0].data[index][3], pid: school, layer: 1, type: 'college' }).lean()
        assert(collegeModel, 422, `系统不存在第${index + 1}行用户的学院信息`)
        model.college = collegeModel._id.toString()

        const gradeModel = await OrganizationModel.findOne({ name: list[0].data[index][4], pid: model.college, layer: 2, type: 'grade' }).lean()
        assert(gradeModel, 422, `系统不存在第${index + 1}行用户的年级信息`)
        model.grade = gradeModel._id.toString()

        const majorModel = await OrganizationModel.findOne({ name: list[0].data[index][5], pid: model.grade, layer: 3, type: 'major' }).lean()
        assert(majorModel, 422, `系统不存在第${index + 1}行用户的专业信息`)
        model.major = majorModel._id.toString()

        const classModel = await OrganizationModel.findOne({ name: list[0].data[index][6], pid: model.major, layer: 4, type: 'class' }).lean()
        assert(classModel, 422, `系统不存在第${index + 1}行用户的班级信息`)
        model.class = classModel._id.toString()

        // 加入模型
        insertModels.push(model)
      }
    }
    await this.model.insertMany(insertModels)
    return {
      message: '导入成功'
    }
  }
  /**
   * 批量导入教师信息
   * @param {String} school 学校id
   * @param {String} file 文件对象
   */
  async importTeacher(school, file) {
    const list = xlsx.parse(file.path);
    const insertModels = []
    const tableHeader = ['姓名', '工号', '手机号', '学院']
    if (list[0].data.length <= 1) {
      assert(false, 422, '请填写数据后导入')
    }
    for (let index = 0; index < list[0].data.length; index++) {
      if (index === 0) { // 表头
        if (list[0].data[index].join(',') !== tableHeader.join(',')) {
          assert(false, 422, '模板格式错误')
        }
      } else {  // 实际数据
        // 用户模型
        const model = {
          phone: list[0].data[index][2],
          password: '123456',
          username: list[0].data[index][0],
          role: 'teacher',
          number: list[0].data[index][1],
          school
        }
        // 数据校验
        if (list[0].data[index].length < tableHeader.length) {
          assert(false, 422, `第${index + 1}行用户数据不完整`)
        }
        const exist = await this.model.findOne({ phone: model.phone })
        assert(!exist, 422, `第${index + 1}行用户的手机号已被注册`)

        const collegeModel = await OrganizationModel.findOne({ name: list[0].data[index][3], pid: school, layer: 1, type: 'college' }).lean()
        assert(collegeModel, 422, `系统不存在第${index + 1}行用户的学院信息`)
        model.college = collegeModel._id.toString()

        // 加入模型
        insertModels.push(model)
      }
    }
    await this.model.insertMany(insertModels)
    return {
      message: '导入成功'
    }
  }
}

module.exports = new AdminUserService()