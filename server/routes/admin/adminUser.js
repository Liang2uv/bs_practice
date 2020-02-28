const express = require('express')
const middlewareAuth = require('../../middlewares/auth')
const AdminUserService = require('../../service/AdminUserService')
const upload = require('../../conf/upload')

const router = express.Router()

// 后台登录
router.post('/login', async (req, res, next) => {
  try { res.send(await AdminUserService.login(req.body['phone'], req.body['password'])) }catch(err) { next(err) }
})

// 根据token获取个人信息
router.get('/token', middlewareAuth(), async (req, res, next) => {
  try { res.send(await AdminUserService.baseFindByIDAndRef(req.user._id, 'schoolInfo|collegeInfo|gradeInfo|majorInfo|classInfo')) }catch(err) { next(err) }
})

// 添加用户
router.post('/', middlewareAuth(), async (req, res, next) => {
  try { res.send(await AdminUserService.addUser(req.body)) }catch(err) { next(err) }
})

// 更新用户
router.put('/:id', middlewareAuth(), async (req, res, next) => {
  try { res.send(await AdminUserService.updateUser(req.params.id, req.body)) }catch(err) { next(err) }
})
// 批量导入学生信息
router.post('/import/student', middlewareAuth(), upload.single('file'), async (req, res, next) => {
  try { res.send(await AdminUserService.importStudent(req.user.school, req.file)) }catch(err) { next(err) }
})
// 批量导入教师信息
router.post('/import/teacher', middlewareAuth(), upload.single('file'), async (req, res, next) => {
  try { res.send(await AdminUserService.importTeacher(req.user.school, req.file)) }catch(err) { next(err) }
})


module.exports = router