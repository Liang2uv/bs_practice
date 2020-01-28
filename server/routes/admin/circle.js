const express = require('express')
const CircleService = require('../../service/CircleService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取圈子列表
router.get('/', async (req, res, next) => {
  try { res.send(await CircleService.getList(req.query['userId'], req.query['name'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})

// 创建圈子
router.post('/', async (req, res, next) => {
  try { res.send(await CircleService.addCircle(req.body)) } catch (err) { next(err) }
})

module.exports = router
