const middlewareAuth = require('../../middlewares/auth')
const middlewareResource = require('../../middlewares/resource')

// admin的所有路由处理
const crudRouter = require('./crud')
const adminUserRouter = require('./adminUser')

const adminRouter = app => {
  // 通用CRUD接口
  app.use('/api/admin/crud/:resource', middlewareAuth(), middlewareResource(), crudRouter)
  // 后台用户路由
  app.use('/api/admin', adminUserRouter)
}

module.exports = adminRouter