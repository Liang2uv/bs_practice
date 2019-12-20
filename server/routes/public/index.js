const middlewareAuth = require('../../middlewares/auth')
const middlewareResource = require('../../middlewares/resource')
const crudRouter = require('./crud')
const uploadRouter = require('./upload')

const publicRouter = app => {
  // 通用CRUD接口
  app.use('/api/public/crud/:resource', middlewareAuth(), middlewareResource(), crudRouter)
  // 上传文件接口
  app.use('/api/public/upload', middlewareAuth(), uploadRouter)
}

module.exports = publicRouter