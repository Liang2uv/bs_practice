const express = require('express')
const DaySummaryService = require('../../service/DaySummaryService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取近七日出勤率
router.get('/seven_days', async (req, res, next) => {
  try { res.send(await DaySummaryService.getSevenDayClock(req.query['mainPlan'])) } catch (err) { next(err) }
})

// 获取某一日的出勤情况（包括班级出勤情况）
router.get('/one_day', async (req, res, next) => {
  try { res.json(await DaySummaryService.getOneDayClock(req.query['mainPlan'], req.query['date'])) } catch (err) { next(err) }
})

module.exports = router
