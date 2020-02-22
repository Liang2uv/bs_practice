const middlewareAuth = require('../../middlewares/auth')
const adminUserRouter = require('./adminUser')
const organizationRouter = require('./organization')
const dayRecordRouter = require('./dayRecord')
const dayOffRouter = require('./dayOff')
const noteRouter = require('./note')
const circleRouter = require('./circle')
const circleUserRouter = require('./circleUser')
const mainPlanRouter = require('./mainPlan')
const scoreRouter = require('./score')
const daySummaryRouter = require('./daySummary')
const otherRouter = require('./other')

const adminRouter = app => {
  app.use('/api/admin/admin_users', adminUserRouter)
  app.use('/api/admin/organizations', middlewareAuth(), organizationRouter)
  app.use('/api/admin/day_records', middlewareAuth(), dayRecordRouter)
  app.use('/api/admin/day_offs', middlewareAuth(), dayOffRouter)
  app.use('/api/admin/notes', middlewareAuth(), noteRouter)
  app.use('/api/admin/circles', middlewareAuth(), circleRouter)
  app.use('/api/admin/circle_users', middlewareAuth(), circleUserRouter)
  app.use('/api/admin/main_plans', middlewareAuth(), mainPlanRouter)
  app.use('/api/admin/scores', middlewareAuth(), scoreRouter)
  app.use('/api/admin/day_summaries', middlewareAuth(), daySummaryRouter)
  app.use('/api/admin/other', middlewareAuth(), otherRouter)
}

module.exports = adminRouter