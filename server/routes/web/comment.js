const express = require('express')
const CommentService = require('../../service/CommentService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取某个帖子的评论列表
router.get('/', async (req, res, next) => {
  try { res.send(await CommentService.getList(req.query['topic'])) } catch (err) { next(err) }
})

// 添加评论
router.post('/', async (req, res, next) => {
  try { res.send(await CommentService.addComment(req.body)) } catch (err) { next(err) }
})

module.exports = router
