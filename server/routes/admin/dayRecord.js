const express = require('express')
const DayRecordService = require('../../service/DayRecordService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取学生的签到列表（老师用）
router.get('/', async (req, res, next) => {
  try { res.send(await DayRecordService.getClockList(req.query['teaId'], req.query['stuSearch'], req.query['status'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})

module.exports = router
