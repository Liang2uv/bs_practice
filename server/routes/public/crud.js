const expresss = require('express')
const mongoose = require('mongoose')

const router = expresss.Router({
  mergeParams: true // 合并参数
})

/*****************************************查询业务(filter/refs/order/paging)**************************************************/
// 查询全部
router.get('/', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAll()) }catch(err) { next(err) }
})
// 查询并分页
router.get('/paging', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndSkipLimit(req.query['page'], req.query['size'])) }catch(err) { next(err) }
})
// 查询并排序
router.get('/order', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndOrder(req.query['order'])) }catch(err) { next(err) }
})
// 查询并排序分页
router.get('/order/paging', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndOrderSkipLimit(req.query['order'], req.query['page'], req.query['size'])) }catch(err) { next(err) }
})
// 关联查询
router.get('/refs', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndRef(req.query['refs'])) }catch(err) { next(err) }
})
// 关联查询并分页
router.get('/refs/paging', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndRefSkipLimit(req.query['refs'], req.query['page'], req.query['size'])) }catch(err) { next(err) }
})
// 关联查询并排序
router.get('/refs/order', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndRefOrder(req.query['refs'], req.query['order'])) }catch(err) { next(err) }
})
// 关联查询并排序分页
router.get('/refs/order/paging', async (req, res, next) => {
  try { res.send(await req.Service.baseFindAllAndRefOrderSkipLimit(req.query['refs'], req.query['order'], req.query['page'], req.query['size'])) }catch(err) { next(err) }
})
// 根据id查询
router.get('/id/:id', async (req, res, next) => {
  try { res.send(await req.Service.baseFindByID(req.params['id'])) }catch(err) { next(err) }
})
// 根据id关联查询
router.get('/id/refs/:id', async (req, res, next) => {
  try { res.send(await req.Service.baseFindByIDAndRef(req.params['id'], req.query['refs'])) }catch(err) { next(err) }
})
// 带条件查询
router.get('/filter', async (req, res, next) => {
  try { res.send(await req.Service.baseFindByFilter(req.query)) }catch(err) { next(err) }
})
// 带条件查询并分页
router.get('/filter/paging', async (req, res, next) => {
  const { page, size, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndSkipLimit(filter, page, size)) }catch(err) { next(err) }
})
// 带条件查询并排序
router.get('/filter/order', async (req, res, next) => {
  const { order, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndOrder(filter, order)) }catch(err) { next(err) }
})
// 带条件查询并排序分页
router.get('/filter/order/paging', async (req, res, next) => {
  const { order, page, size, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndOrderSkipLimit(filter, order, page, size)) }catch(err) { next(err) }
})
// 带条件关联查询
router.get('/filter/refs', async (req, res, next) => {
  const { refs, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndRef(filter, refs)) }catch(err) { next(err) }
})
// 带条件关联查询并分页
router.get('/filter/refs/paging', async (req, res, next) => {
  const { refs, page, size, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndRefSkipLimit(filter, refs, page, size)) }catch(err) { next(err) }
})
// 带条件关联查询并排序
router.get('/filter/refs/order', async (req, res, next) => {
  const { refs, order, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndRefOrder(filter, refs, order)) }catch(err) { next(err) }
})
// 带条件关联查询并排序分页
router.get('/filter/refs/order/paging', async (req, res, next) => {
  const { refs, order, page, size, ...filter } = req.query
  try { res.send(await req.Service.baseFindByFilterAndRefOrderSkipLimit(filter, refs, order, page, size)) }catch(err) { next(err) }
})

/*****************************************添加业务**************************************************/
router.post('/', async (req, res, next) => {
  try { res.send(await req.Service.baseCreateObj(req.body)) }catch(err) { next(err) }
})

/*****************************************修改业务**************************************************/
router.put('/:id', async (req, res, next) => {
  try { res.send(await req.Service.baseUpdateObj(req.params['id'], req.body)) }catch(err) { next(err) }
})

/*****************************************删除业务**************************************************/
router.delete('/:id', async (req, res, next) => {
  try { res.send(await req.Service.baseRemoveObj(req.params['id'])) }catch(err) { next(err) }
})

module.exports = router