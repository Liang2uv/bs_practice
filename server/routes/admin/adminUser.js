const express = require('express')
const { login, addUser, getUserInfo, getUserList, updateUser, deleteUser } = require('../../controller/adminUser')
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

// 获取用户列表（管理员、教师、学生）
router.get('/', middlewareAuth(), async (req, res) => {
  const result = await getUserList(req.query)
  if (result) {
    res.send(result)
  }
})

// 获取用户信息
router.get('/:id', middlewareAuth(), async (req, res) => {
  let user = {}
  if (req.query.self) { // 根据token获取信息（用户获取自身详细信息）
    user = await getUserInfo(req.user._id)
  }else { // 根据id获取用户信息（用于获取别人的详细信息）
    user = await getUserInfo(req.params.id)
  }
  res.send(user)
})

// 添加用户
router.post('/', async (req, res) => {
  const result = await addUser(req.body)
  if (result) {
    res.send(result)
  }
})

// 修改用户信息
router.put('/:id', middlewareAuth(), async (req, res) => {
  const result = await updateUser(req.params.id, req.body)
  if (result) {
    res.send(result)
  }
})

// 删除用户
router.delete('/:id', middlewareAuth(), async (req, res) => {
  const result = await deleteUser(req.params.id)
  if (result) {
    res.send({ message: '删除成功' })
  }
})

module.exports = router