const mongoose = require('mongoose')
const { MONGO_CONF } = require('../conf/db')
const mongo = app => {
  let useDbUser = ''
  if (MONGO_CONF.user && MONGO_CONF.user !== null) {
    useDbUser = `${MONGO_CONF.user}:${MONGO_CONF.password}@`
  }
  mongoose.connect(`mongodb://${useDbUser}${MONGO_CONF.host}:${MONGO_CONF.port}/${MONGO_CONF.database}`, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  // 引入所有模型
  require('require-all')(__dirname + '/../model')

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
}
module.exports = mongo