const crudRouter = require('./crud')
const webRouter = app => {
  // 通用CRUD接口
  app.use('/api/web/rest/:resource',crudRouter)
}

module.exports = webRouter