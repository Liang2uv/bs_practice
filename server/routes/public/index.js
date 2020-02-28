const middlewareAuth = require('../../middlewares/auth')
const middlewareResource = require('../../middlewares/resource')
const crudRouter = require('./crud')
const uploadRouter = require('./upload')
const commonRouter = require('./common')

const publicRouter = app => {
  // 通用CRUD接口
  app.use('/api/public/crud/:resource', middlewareAuth(), middlewareResource(), crudRouter)
  // 上传文件接口
  app.use('/api/public/upload', middlewareAuth(), uploadRouter)
  // 写入一年的休息日
  app.use('/api/public/common', middlewareAuth(), commonRouter)
}

module.exports = publicRouter