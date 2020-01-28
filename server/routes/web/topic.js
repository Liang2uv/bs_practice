const express = require('express')
const TopicService = require('../../service/TopicService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 创建帖子
router.post('/', async (req, res, next) => {
  try { res.send(await TopicService.addTopic(req.body)) } catch (err) { next(err) }
})

module.exports = router
