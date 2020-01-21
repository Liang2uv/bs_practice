const middlewareAuth = require('../../middlewares/auth')
const adminUserRouter = require('./adminUser')
const organizationRouter = require('./organization')
const dayRecordRouter = require('./dayRecord')
const dayOffRouter = require('./dayOff')
const noteRouter = require('./note')

const adminRouter = app => {
  app.use('/api/admin/admin_users', adminUserRouter)
  app.use('/api/admin/organizations', middlewareAuth(), organizationRouter)
  app.use('/api/admin/day_records', middlewareAuth(), dayRecordRouter)
  app.use('/api/admin/day_offs', middlewareAuth(), dayOffRouter)
  app.use('/api/admin/notes', middlewareAuth(), noteRouter)
}

module.exports = adminRouter