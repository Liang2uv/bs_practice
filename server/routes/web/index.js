const adminUserRouter = require('./adminUser')

const webRouter = app => {
  app.use('/api/web/admin_users', adminUserRouter)
}
module.exports = webRouter