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
  // // populate()方法表示取出关联字段的文档
  // const queryOptions = {}
  // // 判断获取列表的时候是否需要关联查询
  // if (req.Model.modelName === 'Category') {
  //   queryOptions.populate = 'parent'
  // }
  // const models = await req.Model.find().setOptions(queryOptions).limit(100)
  const models = await req.Model.find().limit(40)
  res.send(models)
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
    status: true
  })
})

module.exports = router