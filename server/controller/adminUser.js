const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRECT } = require('../conf/secrect.js')
const assert = require('http-assert')
const AdminUser = require('../model/AdminUser')
const mongoose = require('mongoose')


/**
 * 登录
 * @param {*} phone 
 * @param {*} password 
 */
const login = async (phone, password) => {
  // 1. 根据用户名找用户
  const user = await AdminUser.findOne({ phone }).select('+password')
  assert(user, 422, '用户不存在')
  // 2. 校验密码
  const isValid = bcryptjs.compareSync(password, user.password)
  assert(isValid, 422, '密码错误')
  // 3. 生成token
  const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: '2 days' })
  // 4. 获取用户信息
  const userInfo = await getUserInfo(user.id)
  return { token, userInfo }
}

/**
 * 添加用户
 * @param {*} data 
 */
const addUser = async data => {
  if (await AdminUser.find({ phone: data.phone }).countDocuments() > 0) {
    assert(false, 422, '手机号已被注册')
  }
  try {
    const user = await AdminUser.create(data)
    return await getUserInfo(user._id)
  } catch (ex) {
    assert(false, 422, `请求出错`)
  }
}

/**
 * 获取用户信息
 */

const getUserInfo = async id => {
  const result = await AdminUser.findById(id).populate('school college grade major class').lean()
  if (result.school) {
    result.schoolInfo = result.school
    result.school = result.schoolInfo._id
  }
  if (result.college) {
    result.collegeInfo = result.college
    result.college = result.collegeInfo._id
  }
  if (result.grade) {
    result.gradeInfo = result.grade
    result.grade = result.gradeInfo._id
  }
  if (result.major) {
    result.majorInfo = result.major
    result.major = result.majorInfo._id
  }
  if (result.class) {
    result.classInfo = result.class
    result.class = result.classInfo._id
  }
  return result
}

/**
 * 获取用户列表
 */

const getUserList = async (page, size, search, key, role, school) => {
  const whereOptions = { [key]: { $regex: search }, role: { $regex: role } }
  if (school) {
    whereOptions.school = mongoose.Types.ObjectId(school)
  }
  const total = await AdminUser.find().where(whereOptions).countDocuments()
  const list = await AdminUser.find().where(whereOptions).populate('school college grade major class').skip(size * (page - 1)).limit(size).lean()
  list.forEach(item => {
    if (item.school) {
      item.schoolInfo = item.school
      item.school = item.schoolInfo._id
    }
    if (item.college) {
      item.collegeInfo = item.college
      item.college = item.collegeInfo._id
    }
    if (item.grade) {
      item.gradeInfo = item.grade
      item.grade = item.gradeInfo._id
    }
    if (item.major) {
      item.majorInfo = item.major
      item.major = item.majorInfo._id
    }
    if (item.class) {
      item.classInfo = item.class
      item.class = item.classInfo._id
    }
  })
  return { total, list }
}

/**
 * 更新用户信息
 */
const updateUser = async (id, data) => {
  if (await AdminUser.find({ phone: data.phone, _id: { $ne: mongoose.Types.ObjectId(id) } }).countDocuments() > 0) {
    assert(false, 422, '手机号已被注册')
  }
  try {
    const user = await AdminUser.findByIdAndUpdate(id, data, { new: true })
    return await getUserInfo(user._id)
  } catch (ex) {
    assert(false, 422, `请求出错`)
  }
}

/**
 * 删除用户
 */
const deleteUser = async id => {
  try {
    await AdminUser.findByIdAndRemove(id)
  } catch (error) {
    assert(false, 422, '删除失败')
  }
}

module.exports = {
  login,
  addUser,
  getUserInfo,
  getUserList,
  updateUser,
  deleteUser
}