const express = require('express')
const { getTreeList, getOrgan, addOrgan, updateOrgan, deleteOrgan } = require('../../controller/organization')
const middlewareAuth = require('../../middlewares/auth')

const router = express.Router()

// 获取列表
router.get('/', middlewareAuth(), async (req, res) => {
  // 获取树级列表
  if (req.query.type && req.query.type === 'tree') {
    const result = await getTreeList(req.query.school)
    res.send(result)
  } else {
    res.send([])
  }
})

// 获取详情
router.get('/:id', middlewareAuth(), async (req, res) => {
  return await getOrgan(req.params.id)
})

// 添加
router.post('/', middlewareAuth(), async (req, res) => {
  const result = await addOrgan(req.body)
  if (result) {
    res.send(result)
  }
})

// 修改
router.put('/:id', middlewareAuth(), async (req, res) => {
  const result = await updateOrgan(req.params.id, req.body)
  if (result) {
    res.send(result)
  }
})

// 删除
router.delete('/:id', middlewareAuth(), async (req, res) => {
  const result = await deleteOrgan(req.params.id)
  if (result) {
    res.send({ message: '删除成功' })
  }
})

module.exports = router