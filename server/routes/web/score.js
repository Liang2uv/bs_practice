const express = require('express')
const ScoreService = require('../../service/ScoreService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取某个学生的实习成绩
router.get('/student', async (req, res, next) => {
  try { res.send(await ScoreService.getStudentScore(req.query['student'])) } catch (err) { next(err) }
})

module.exports = router
