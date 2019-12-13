const expresss = require('express')

const router = expresss.Router({
  mergeParams: true // 合并参数
})

// 添加
router.post('/', async (req, res) => {
  const model = await req.Model.create(req.body)
  res.send(model)
})
// 修改
router.put('/:id', async (req, res) => {
  const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
  res.send(model)
})
// 列表
router.get('/', async (req, res) => {
  let { page = 1, size = 30, search = '', key = 'name' } = req.query
  size = parseInt(size)
  page = parseInt(page)
  const result = await req.Model.aggregate([
    { $match: { [key]: { $regex: search } } },
    {
      $group: {
        _id: null,
        list: { $push: "$$ROOT" },
        total: { $sum: 1 }
      }
    },
    {
      $addFields: {
        list: { $slice: ['$list', size * (page - 1), size] }
      }
    },
    {
      $project: { _id: 0 }
    }
  ])
  res.send(result[0] || { list: [], total: 0 })
})
// 获取单个
router.get('/:id', async (req, res) => {
  const model = await req.Model.findById(req.params.id)
  res.send(model)
})
// 删除
router.delete('/:id', async (req, res) => {
  await req.Model.findByIdAndRemove(req.params.id)
  res.send({
    message: '删除成功'
  })
})

module.exports = router