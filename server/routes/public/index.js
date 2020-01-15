const middlewareAuth = require('../../middlewares/auth')
const middlewareResource = require('../../middlewares/resource')
const crudRouter = require('./crud')
const uploadRouter = require('./upload')
const commonRouter = require('./common')

const publicRouter = app => {
  // 通用CRUD接口
  app.use('/api/public/crud/:resource', middlewareAuth(), middlewareResource(), crudRouter)
  // 上传文件接口
  app.use('/api/public/upload', middlewareAuth(), uploadRouter)
  // 重置所有数据
  app.get('/api/public/initdb', middlewareAuth(), async (req, res) => {
    const AdminUser = require('../../model/AdminUser')
    const MainPlan = require('../../model/MainPlan')
    const Organization = require('../../model/Organization')
    await AdminUser.deleteMany({})
    await MainPlan.deleteMany({})
    await Organization.deleteMany({})
    await AdminUser.create({ phone:'13768131070',password:'123456',username:'梁冰',role:'superadmin',status:1 })
    res.send({ message: '重置成功' })
  })
  // 写入一年的休息日
  app.use('/api/public/common', middlewareAuth(), commonRouter)
}

module.exports = publicRouter