const express = require('express')
const MainPlanService = require('../../service/MainPlanService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 查询某个老师需要指导的实习计划id
router.get('/teacher', async (req, res, next) => {
  try { res.send(await MainPlanService.getListForTeacher(req.query['teacher'])) } catch (err) { next(err) }
})

module.exports = router
