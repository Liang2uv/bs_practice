const express = require('express')
const middlewareAuth = require('../../middlewares/auth')
const OrganizationService = require('../../service/OrganizationService')

const router = express.Router()

// 获取树级列表
router.get('/tree', middlewareAuth(), async (req, res, next) => {
  try { res.send(await OrganizationService.getTreeList(req.query['startLayer'], req.query['endLayer'], req.query['pid'])) }catch(err) { next(err) }
})

// 添加
router.post('/', middlewareAuth(), async (req, res, next) => {
  try { res.send(await OrganizationService.addOrgan(req.body)) }catch(err) { next(err) }
})

// 删除
router.delete('/:id', middlewareAuth(), async (req, res, next) => {
  try { res.send(await OrganizationService.deleteOrgan(req.params.id)) }catch(err) { next(err) }
})

module.exports = router