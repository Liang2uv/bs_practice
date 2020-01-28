/**
 * 每天16:00进行签到预警提醒
 */

(async function () {
  const mongoose = require('mongoose')
  const DayRecord = require('../model/DayRecord')
  const Message = require('../model/Message')
  const { dataSetTime } = require('../utils/utils')

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
    const sNow = dataSetTime(new Date())
    const eNow = dataSetTime(new Date(), '23')
    // 查找今天未签到的同学
    const days = await DayRecord.find({ date: { $gte: sNow, $lte: eNow }, status: 0 }).lean()
    // 给予他们签到预警
    const message = days.map(v => {
      return {
        content: '今天尚未签到，请尽快签到',
        receive: v.student,
        type: 'warning',
        status: 0
      }
    })
    await Message.insertMany(message)
  } catch (error) {
    console.log(error)
  }
  mongoose.disconnect()
}())
