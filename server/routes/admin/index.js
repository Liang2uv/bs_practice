const middlewareAuth = require('../../middlewares/auth')
const adminUserRouter = require('./adminUser')
const organizationRouter = require('./organization')
const dayRecordRouter = require('./dayRecord')
const dayOffRouter = require('./dayOff')
const noteRouter = require('./note')
const circleRouter = require('./circle')
const mainPlanRouter = require('./mainPlan')
const scoreRouter = require('./score')

const adminRouter = app => {
  app.use('/api/admin/admin_users', adminUserRouter)
  app.use('/api/admin/organizations', middlewareAuth(), organizationRouter)
  app.use('/api/admin/day_records', middlewareAuth(), dayRecordRouter)
  app.use('/api/admin/day_offs', middlewareAuth(), dayOffRouter)
  app.use('/api/admin/notes', middlewareAuth(), noteRouter)
  app.use('/api/admin/circles', middlewareAuth(), circleRouter)
  app.use('/api/admin/main_plans', middlewareAuth(), mainPlanRouter)
  app.use('/api/admin/scores', middlewareAuth(), scoreRouter)
}

module.exports = adminRouter