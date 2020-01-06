const express = require('express')
const { wxLogin } = require('../../controller/adminUser')
const middlewareAuth = require('../../middlewares/auth')
const assert = require('http-assert')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 小程序端登录
router.post('/login', async (req, res) => {
  const { phone, password, code } = req.body
  assert(phone && password && code, 400, '请求参数错误')
  await wxLogin(req, res)
})

module.exports = router
