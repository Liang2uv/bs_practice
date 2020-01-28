const express = require('express')
const NoteService = require('../../service/NoteService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 添加实习记录
router.post('/', async (req, res, next) => {
  try { res.send(await NoteService.addNote(req.body)) } catch (err) { next(err) }
})

module.exports = router
