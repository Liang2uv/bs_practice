const express = require('express')
const CircleUserService = require('../../service/CircleUserService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 创建圈子
router.put('/bulk', async (req, res, next) => {
  try { res.send(await CircleUserService.addBulk(req.body['circle'], req.body['userRole'], req.body['status'], req.body['users'])) } catch (err) { next(err) }
})

// 获取学生申请进入圈子列表（老师用）
router.get('/', async (req, res, next) => {
  try { res.send(await CircleUserService.getReviewList(req.query['teaId'], req.query['stuSearch'], req.query['status'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})

module.exports = router
