const middlewareAuth = require('../../middlewares/auth')
const adminUserRouter = require('./adminUser')
const taskRouter = require('./task')
const circleUserRouter = require('./circleUser')
const noteRouter = require('./note')
const topicRouter = require('./topic')

const webRouter = app => {
  app.use('/api/web/admin_users', adminUserRouter)
  app.use('/api/web/tasks', middlewareAuth(), taskRouter)
  app.use('/api/web/circle_users', middlewareAuth(), circleUserRouter)
  app.use('/api/web/notes', middlewareAuth(), noteRouter)
  app.use('/api/web/topics', middlewareAuth(), topicRouter)
}
module.exports = webRouter