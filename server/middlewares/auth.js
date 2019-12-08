// 登录校验中间件
const jwt = require('jsonwebtoken')
const assert = require('http-assert')
const AdminUser = require('../model/AdminUser')
const { JWT_SECRECT } = require('../conf/secrect')

const middlewareAuth = () => {
  return async (req, res, next) => {
    const token = String(req.headers.authorization || '').split(' ')[1]
    assert(token, 401, { message: '请先登录' })
    try {
      const { id } = jwt.verify(token, JWT_SECRECT)
      assert(id, 401, { message: '请先登录' })
      req.user = await AdminUser.findById(id)
      assert(req.user, 401, { message: '请先登录' })
    } catch (error) {
      assert(false, 401, { message: error.message })
    }
    next()
  }
}

module.exports = middlewareAuth