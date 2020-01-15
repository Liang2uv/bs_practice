const express = require('express')
const TaskService = require('../../service/TaskService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取有效的实习天数
router.get('/work_days', async (req, res, next) => {
  try { res.send(await TaskService.getValidDays(req.query['startAt'], req.query['endAt'], req.query['mainPlan'])) } catch (err) { next(err) }
})

// 添加实习任务
router.post('/', async (req, res, next) => {
  try { res.send(await TaskService.addTask(req.body)) } catch (err) { next(err) }
})


module.exports = router
