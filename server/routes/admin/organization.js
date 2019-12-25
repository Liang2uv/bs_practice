const express = require('express')
const { getTreeList, getList, getOrgan, addOrgan, updateOrgan, deleteOrgan } = require('../../controller/organization')
const middlewareAuth = require('../../middlewares/auth')
const assert = require('http-assert')

const router = express.Router()

// 获取列表
router.get('/', middlewareAuth(), async (req, res) => {
  // 获取某个层级的（返回非树形数据）
  const { type } = req.query
  assert(type === 'tree' || type === 'notree', 400, '请求参数错误')
  if (type === 'tree') {  // 获取树级列表
    if (req.user.role === 'superadmin') {
      let { startLayer = 0, endLayer = 4, pid = '0' } = req.query
      startLayer = parseInt(startLayer)
      endLayer = parseInt(endLayer)
      assert(pid && startLayer >= 0 && endLayer >= 0 && startLayer <= endLayer, 400, '请求参数错误')
      res.send(await getTreeList(pid, startLayer, endLayer))
    } else {  // 非超级管理员只能获取所在学校的数据
      let { startLayer = 1, endLayer = 4 } = req.query
      startLayer = parseInt(startLayer)
      endLayer = parseInt(endLayer)
      assert(startLayer >= 0 && endLayer >= 0 && startLayer <= endLayer, 400, '请求参数错误')
      assert(req.user.school, 403, '服务端拒绝该请求')
      res.send(await getTreeList(req.user.school.toString(), startLayer, endLayer))
    }
  } else {  // 获取某一层级列表
    let { pid, layer, page = 1, size = 30, search = '', key = 'name' } = req.query
    layer = parseInt(layer)
    assert(layer >= 0, 400, '请求参数错误')
    assert(pid || layer === 0, 400, '请求参数错误')
    res.send(await getList(pid, layer, page, size, search, key))
  }
})

// 获取详情
router.get('/:id', middlewareAuth(), async (req, res) => {
  res.send(await getOrgan(req.params.id))
})

// 添加
router.post('/', middlewareAuth(), async (req, res) => {
  const { name, pid } = req.body
  assert(name && pid, 400, '请求参数错误')
  res.send(await addOrgan({ name, pid }))
})

// 修改
router.put('/:id', middlewareAuth(), async (req, res) => {
  const { name } = req.body
  res.send(await updateOrgan(req.params.id, { name }))
})

// 删除
router.delete('/:id', middlewareAuth(), async (req, res) => {
  await deleteOrgan(req.params.id)
  res.send({ message: '删除成功' })
})

module.exports = router