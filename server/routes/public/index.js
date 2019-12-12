const middlewareAuth = require('../../middlewares/auth')
const middlewareResource = require('../../middlewares/resource')
const crudRouter = require('./crud')

const publicRouter = app => {
  // 通用CRUD接口
  app.use('/api/public/crud/:resource', middlewareAuth(), middlewareResource(), crudRouter)
}

module.exports = publicRouter