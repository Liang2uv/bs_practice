const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRECT } = require('../conf/secrect.js')
const assert = require('http-assert')
const AdminUser = require('../model/AdminUser')


/**
 * 登录
 * @param {*} phone 
 * @param {*} password 
 */
const login = async (phone, password) => {
  // 1. 根据用户名找用户
  const user = await AdminUser.findOne({ phone }).select('+password')
  assert(user, 422, { message: '用户不存在' })
  // 2. 校验密码
  const isValid = bcryptjs.compareSync(password, user.password)
  assert(isValid, 422, { message: '密码错误' })
  // 3. 生成token
  const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: 60 })
  return token
}

/**
 * 注册
 * @param {*} data 
 */
const register = async data => {
  try {
    return await AdminUser.create(data)
  } catch (ex) {
    assert(false, 422, { message: `请求出错${ex._message}` })
  }
}

module.exports = {
  login,
  register
}