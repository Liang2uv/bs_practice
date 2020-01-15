const adminUserRouter = require('./adminUser')
const taskRouter = require('./task')

const webRouter = app => {
  app.use('/api/web/admin_users', adminUserRouter)
  app.use('/api/web/tasks', taskRouter)
}
module.exports = webRouter