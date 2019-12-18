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
        from: 'organizations',
        localField: 'college',
        foreignField: '_id',
        as: 'collegeInfo'
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'grade',
        foreignField: '_id',
        as: 'gradeInfo'
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'major',
        foreignField: '_id',
        as: 'majorInfo'
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'class',
        foreignField: '_id',
        as: 'classInfo'
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
  let { page = 1, size = 30, search = '', key = 'username', role = '', school } = query
  size = parseInt(size)
  page = parseInt(page)
  const arr = [
    { $match: { [key]: { $regex: search }, role: { $regex: role } } },
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
        from: 'organizations',
        localField: 'college',
        foreignField: '_id',
        as: 'collegeInfo'
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'grade',
        foreignField: '_id',
        as: 'gradeInfo'
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'major',
        foreignField: '_id',
        as: 'majorInfo'
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'class',
        foreignField: '_id',
        as: 'classInfo'
      }
    },
    {
      $project: { password: 0 }
    },
    {
      $group: {
        _id: null,
        list: { $push: "$$ROOT" },
        total: { $sum: 1 }
      }
    },
    {
      $addFields: {
        list: { $slice: ['$list', size * (page - 1), size] }
      }
    },
    {
      $project: { _id: 0 }
    }
  ]
  if (school) {
    arr.splice(1, 0, { $match: { school: mongoose.Types.ObjectId(school) } })
  }
  const result = await AdminUser.aggregate(arr)
  return result[0] || { list: [], total: 0 }
}

/**
 * 更新用户信息
 */
const updateUser = async (id, data) => {
  if (await AdminUser.find({ phone: data.phone }).countDocuments() > 0) {
    assert(false, 422, '手机号已被注册')
  }
  try {
    const user = await AdminUser.findByIdAndUpdate(id, data)
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
    return true
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