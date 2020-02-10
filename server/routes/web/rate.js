const express = require('express')
const RateService = require('../../service/RateService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 邀请评价
router.post('/', async (req, res, next) => {
  try { res.send(await RateService.invite(req.user._id.toString(), req.body['rater'], req.body['task'], req.body['type'])) } catch (err) { next(err) }
})

module.exports = router
