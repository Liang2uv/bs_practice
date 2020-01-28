const express = require('express')
const MessageService = require('../../service/MessageService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 批量修改消息状态
router.post('/bulk', async (req, res, next) => {
  try { res.send(await MessageService.bulkUpdateStatus(req.body['status'], req.body['ids'])) } catch (err) { next(err) }
})

module.exports = router
