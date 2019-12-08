const express = require('express')
const { login, register } = require('../../controller/adminUser')
const middlewareAuth = require('../../middlewares/auth')

const router = express.Router()

// 登录
router.post('/login', async (req, res) => {
  const { phone = '', password = '' } = req.body
  const result = await login(phone, password)
  if (result) {
    res.status(200).send(result)
  }
})

// 注册
router.post('/register', async (req, res) => {
  const result = await register(req.body)
  if (result) {
    res.send({ message: '注册成功' })
  }
})

// 测试是否登录
router.get('/login-test', middlewareAuth(), (req, res) => {
  res.send('已登录')
})


module.exports = router