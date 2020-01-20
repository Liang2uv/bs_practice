const express = require('express')
const DayOffService = require('../../service/DayOffService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取学生的请假列表（老师用）
router.get('/', async (req, res, next) => {
  try { res.send(await DayOffService.getList(req.query['teaId'], req.query['stuSearch'], req.query['status'], req.query['page'], req.query['size'])) } catch (err) { next(err) }
})


// 更新请假申请
router.put('/:id', async (req, res, next) => {
  try { res.send(await DayOffService.updateDayOff(req.params['id'], req.body)) } catch (err) { next(err) }
})

module.exports = router
