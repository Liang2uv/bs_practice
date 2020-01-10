const BaseService = require('./BaseService')
const AdminUserModel = require('../model/AdminUser')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const assert = require('http-assert')
const { JWT_SECRECT, WX_APPID, WX_SECRECT } = require('../conf/secrect')
const { EXPIRESIN } = require('../conf/variable')
const mongoose = require('mongoose')
const axios = require('axios')

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
    // 4. 将openid与账号绑定
    await this.model.updateObj(user._id, { openid: data.openid })
    // 5. 生成token
    const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: EXPIRESIN })
    // 5. 获取用户信息
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
}

module.exports = new AdminUserService()