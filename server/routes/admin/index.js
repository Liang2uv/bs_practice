const adminUserRouter = require('./adminUser')
const organizationRouter = require('./organization')
const dayRecordRouter = require('./dayRecord')
const middlewareAuth = require('../../middlewares/auth')

const adminRouter = app => {
  app.use('/api/admin/admin_users', adminUserRouter)
  app.use('/api/admin/organizations', middlewareAuth(), organizationRouter)
  app.use('/api/admin/day_records', middlewareAuth(), dayRecordRouter)
}

module.exports = adminRouter