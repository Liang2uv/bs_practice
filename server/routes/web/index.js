const adminUserRouter = require('./adminUser')
const taskRouter = require('./task')
const middlewareAuth = require('../../middlewares/auth')

const webRouter = app => {
  app.use('/api/web/admin_users', adminUserRouter)
  app.use('/api/web/tasks', middlewareAuth(), taskRouter)
}
module.exports = webRouter