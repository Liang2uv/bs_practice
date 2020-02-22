const express = require('express')
const OtherService = require('../../service/OtherService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取待审核个数（后台首页展示需要）
router.get('/review_sum', async (req, res, next) => {
  try { res.send(await OtherService.getReviewSum(req.user._id.toString())) } catch (err) { next(err) }
})

module.exports = router
