const express = require('express')
const AdminUserService = require('../../service/AdminUserService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 小程序端登录
router.post('/login', async (req, res, next) => {
  try { res.send(await AdminUserService.wxLogin(req.body['code'])) } catch (err) { next(err) }
})

// 绑定账号
router.post('/bind', async (req, res, next) => {
  try { res.send(await AdminUserService.wxBind(req.body['phone'], req.body['password'], req.body['code'])) } catch (err) { next(err) }
})

// 注册账号
router.post('/register', async (req, res, next) => {
  try { res.send(await AdminUserService.addUser(req.body)) } catch (err) { next(err) }
})

module.exports = router
