/**
 * 初始化数据库
 */

(async function () {
  const mongoose = require('mongoose')
  const AdminUserModel = require('../model/AdminUser')

  // ---------------- 数据库连接 --------------------
  mongoose.connect(`mongodb://localhost:27017/bs-practice`, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  // 监听连接
  mongoose.connection.once('open', function () {
    console.log("数据库连接成功~~~")
  })
  // 监听连接
  mongoose.connection.once('error', function () {
    console.log("数据库连接失败~~~")
  })
  // 监听断开连接
  mongoose.connection.once('close', function () {
    console.log("数据库已断开连接~~~")
  })
  // --------- 业务逻辑 -----------------
  try {
    await mongoose.connection.dropDatabase()
    await AdminUserModel.create({
      phone: '13768131070',
      username: '梁冰',
      role: 'superadmin',
      password: '123456'
    })
  } catch (error) {
    console.log(error)
  }
  mongoose.disconnect()
}())
