const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRECT, EXPIRESIN } = require('../conf/secrect')
const assert = require('http-assert')
const AdminUser = require('../model/AdminUser')
const mongoose = require('mongoose')
const https = require('https')
const { WX_APPID, WX_SECRECT } = require('../conf/secrect')

/**
 * 服务端登录
 * @param {*} phone 手机号
 * @param {*} password 密码
 */
const login = async (phone, password) => {
  // 1. 根据用户名找用户
  const user = await AdminUser.findOne({ phone }).select('+password')
  assert(user, 422, '用户不存在')
  // 2. 校验密码
  const isValid = bcryptjs.compareSync(password, user.password)
  assert(isValid, 422, '密码错误')
  // 3. 生成token
  const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: EXPIRESIN + ' days' })
  // 4. 获取用户信息
  const userInfo = await getUserInfo(user.id)
  return { token, userInfo }
}

/**
 * 小程序服务端登录
 * @param {*} phone 手机号
 * @param {*} password 密码
 * @param {*} code code
 */
const wxLogin = async (req, res) => {
  const { phone, password, code } = req.body
  // 1. 根据用户名找用户
  const user = await AdminUser.findOne({ phone }).select('+password').lean()
  assert(user, 422, '用户不存在')
  // 2. 校验密码
  const isValid = bcryptjs.compareSync(password, user.password)
  assert(isValid, 422, '密码错误')
  // 3. 使用code登录微信服务，换取openid
  https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRECT}&js_code=${code}&grant_type=authorization_code`, wxres => {
    let data = '';
    wxres.on('data', chunk => {
      data += chunk;//监听数据响应，拼接数据片段
    })
    wxres.on('end', async () => {
      data = data.toString()
      console.log(data);
      if (!data.openid) {
        console.log('return 了');
        // return [{ code: 422, message: data.errmsg }, null]
        return res.status(422).end(data.errmsg)
      }
      console.log('检验openid');
      // 4. 检验openid
      if (!user.openid) {  // 第一次使用微信登录
        try {
          console.log(data.openid);
          await updateUser(user._id, { openid: data.openid })
        } catch (ex) {
          // return [{ code: 422, message: '服务端登录失败' }, null]
          return res.status(422).end('服务端登录失败')
        }
      } else {  // 已登录过，比较openid是否一样
        if (user.openid !== data.openid) {
          // return [{ code: 422, message: '该账号已绑定其他微信' }, null]
          return res.status(422).end('该账号已绑定其他微信')
        }
      }
      // 3. 生成token
      const token = jwt.sign({ id: user._id }, JWT_SECRECT, { expiresIn: EXPIRESIN + ' days' })
      // 4. 获取用户信息
      const userInfo = await getUserInfo(user.id)
      // return [null, { token, userInfo }]
      res.send({ token, userInfo })
    })
  })
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
  deleteUser,
  wxLogin
}