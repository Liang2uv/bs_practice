const express = require('express')
const ScoreService = require('../../service/ScoreService')

const router = express.Router({
  mergeParams: true // 合并参数
})
// 获取学生的实习成绩列表（老师用）
router.get('/', async (req, res, next) => {
  try { res.send(await ScoreService.getList(req.query['mainPlan'], req.query['stuSearch'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})
// 统计一个实习计划的所有学生成绩
router.post('/main_plan', async (req, res, next) => {
  try { res.send(await ScoreService.calcMainPlan(req.body['mainPlan'])) } catch (err) { next(err) }
})
// 统计一个学生在某个实习计划的成绩
router.post('/student', async (req, res, next) => {
  try { res.send(await ScoreService.calcStudent(req.body['student'], req.body['mainPlan'])) } catch (err) { next(err) }
})

module.exports = router
