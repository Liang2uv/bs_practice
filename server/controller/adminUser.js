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
  const result = await AdminUser.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'schools',
        localField: 'school',
        foreignField: '_id',
        as: 'schoolInfo'
      }
    },
    {
      $lookup: {
        from: 'majors',
        localField: 'major',
        foreignField: '_id',
        as: 'majorInfo'
      }
    },
    {
      $lookup: {
        from: 'stuclasses',
        localField: 'stuClass',
        foreignField: '_id',
        as: 'stuClassInfo'
      }
    },
    {
      $project: { password: 0 }
    }
  ])
  return result[0] || {}
}

/**
 * 获取用户列表
 */

const getUserList = async query => {
  let { page = 1, size = 30, search = '', role } = query
  const queryOptions = {}
  if (role === 'admin' || role === 'superadmin') {
    queryOptions.populate = 'school'
  } else if (role === 'teacher') {
    queryOptions.populate = 'school college'
  } else if (role === 'student') {
    queryOptions.populate = 'school college stuClass'
  } else {
    assert(false, 400, `请求参数错误`)
  }
  const total = await AdminUser.find({ username: { $regex: search } }).countDocuments()
  size = parseInt(size)
  page = parseInt(page)
  const list = await AdminUser.find({ username: { $regex: search }, role }).setOptions(queryOptions).skip(size * (page - 1)).limit(size)
  return { list, total }
}

/**
 * 更新用户信息
 */
const updateUser = async (id, data) => {
  return await AdminUser.findByIdAndUpdate(id, data)
}

/**
 * 删除用户
 */
const deleteUser = async id => {
  await AdminUser.findByIdAndRemove(id)
  return true
}

module.exports = {
  login,
  addUser,
  getUserInfo,
  getUserList,
  updateUser,
  deleteUser
}