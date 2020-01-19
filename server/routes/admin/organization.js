const express = require('express')
const OrganizationService = require('../../service/OrganizationService')
const router = express.Router()

// 获取树级列表
router.get('/tree', async (req, res, next) => {
  try { res.send(await OrganizationService.getTreeList(req.query['startLayer'], req.query['endLayer'], req.query['pid'])) }catch(err) { next(err) }
})

// 添加
router.post('/', async (req, res, next) => {
  try { res.send(await OrganizationService.addOrgan(req.body)) }catch(err) { next(err) }
})

// 删除
router.delete('/:id', async (req, res, next) => {
  try { res.send(await OrganizationService.deleteOrgan(req.params.id)) }catch(err) { next(err) }
})

module.exports = router