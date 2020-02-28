const CommonService = require('../../service/CommonService')
const express = require('express')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 写入一年的休息日
router.get('/write_holidays', async (req, res, next) => {
  if (req.user.role === 'superadmin') {
    try { res.send(await CommonService.writeHolidays(req.query['year'])) }catch(err) { next(err) }
  } else {
    res.status(403).send('无权限')
  }
})

module.exports = router