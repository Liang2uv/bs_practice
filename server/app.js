// 引入相关模块
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const fs = require('fs')
const logger = require('morgan')
const cors = require('cors')

// 创建服务器
const app = express()

// 开发环境 / 线上环境 的跨域处理
if (process.env.NODE_ENV === 'dev') { 
  app.use(cors())
}

// 初始化mongo数据库
require('./db/mongo')(app)

// post参数挂载到req.body上
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 静态文件托管
app.use('/tmp', express.static(__dirname + '/tmp'));

// 路由配置
require('./routes/public/index')(app)
require('./routes/admin/index')(app)
require('./routes/web/index')(app)

// 404错误
app.use(function (req, res, next) {
  next(createError(404))
})

// 全局错误处理
app.use(function (err, req, res, next) {
  const statusCode = err.statusCode || 500
  console.log(err.message);
  res.status(statusCode).send({
    message: statusCode === 500 ? '服务器内部错误' : err.message
  })
})

// 开发环境 / 线上环境 的日志处理
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(logger('dev'))
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}


module.exports = app
