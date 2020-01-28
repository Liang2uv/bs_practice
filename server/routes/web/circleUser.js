const express = require('express')
const CircleUserService = require('../../service/CircleUserService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 学生加入圈子
router.post('/', async (req, res, next) => {
  try { res.send(await CircleUserService.joinCircle(req.body['user'], req.body['circle'])) } catch (err) { next(err) }
})

module.exports = router
