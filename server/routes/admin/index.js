const adminUserRouter = require('./adminUser')
const organizationRouter = require('./organization')

const adminRouter = app => {
  app.use('/api/admin/adminUsers', adminUserRouter)
  app.use('/api/admin/organizations', organizationRouter)
}

module.exports = adminRouter