const express = require('express')
const { login, addUser, getUserInfo, getUserList, updateUser, deleteUser } = require('../../controller/adminUser')
const middlewareAuth = require('../../middlewares/auth')
const assert = require('http-assert')

const router = express.Router()

// 登录
router.post('/login', async (req, res) => {
  const { phone, password } = req.body
  assert(phone && password, 400, '请求参数错误')
  const result = await login(phone, password)
  if (result) {
    res.status(200).send(result)
  }
})

// 获取用户列表（管理员、教师、学生）
router.get('/', middlewareAuth(), async (req, res) => {
  let { page = 1, size = 30, search = '', key = 'username', role = '', school } = req.query
  size = parseInt(size)
  page = parseInt(page)
  assert(role !== '', 400, '请求参数错误')
  if (req.user.role !== 'superadmin') {
    school = req.user.school.toString()
  }
  const result = await getUserList(page, size, search, key, role, school)
  if (result) {
    res.send(result)
  }
})

// 获取用户信息
router.get('/:id', middlewareAuth(), async (req, res) => {
  let user = {}
  if (req.params.id === 'undefined') { // 根据token获取信息（用户获取自身详细信息）
    user = await getUserInfo(req.user._id)
  } else { // 根据id获取用户信息（用于获取别人的详细信息）
    user = await getUserInfo(req.params.id)
  }
  res.send(user)
})

// 添加用户
router.post('/', async (req, res) => {
  res.send(await addUser(req.body))
})

// 修改用户信息
router.put('/:id', middlewareAuth(), async (req, res) => {
  res.send(await updateUser(req.params.id, req.body))
})

// 删除用户
router.delete('/:id', middlewareAuth(), async (req, res) => {
  const result = await deleteUser(req.params.id)
  res.send({ message: '删除成功' })
})

module.exports = router