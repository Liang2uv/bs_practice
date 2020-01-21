const express = require('express')
const NoteService = require('../../service/NoteService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取学生的实习记录列表（老师用）
router.get('/', async (req, res, next) => {
  try { res.send(await NoteService.getList(req.query['teaId'], req.query['stuSearch'], req.query['type'] ,req.query['status'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})

module.exports = router
