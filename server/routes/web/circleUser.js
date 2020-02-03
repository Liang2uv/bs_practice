const express = require('express')
const CircleUserService = require('../../service/CircleUserService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 学生加入圈子
router.post('/', async (req, res, next) => {
  try { res.send(await CircleUserService.joinCircle(req.body['user'], req.body['circle'])) } catch (err) { next(err) }
})
// 获取某个圈子的进圈申请列表（老师用）
router.get('/', async (req, res, next) => {
  try { res.send(await CircleUserService.getCircleReviewList(req.query['circle'], req.query['stuSearch'], req.query['status'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})

module.exports = router
