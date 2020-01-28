/**
 * 每天00:30更新昨天工作日状态和实习任务状态
 */

(async function () {
  const mongoose = require('mongoose')
  const DayRecord = require('../model/DayRecord')
  const Task = require('../model/Task')
  const { dateCompare } = require('../utils/utils')

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
  const now = new Date()
  const yesterday = new Date()
  yesterday.setTime(yesterday.getTime() - 24 * 3600 * 1000)
  yesterday.setHours(23)
  yesterday.setMinutes(59)
  yesterday.setSeconds(59)
  yesterday.setMilliseconds(999)
  try {
    // 未签到的都改为缺勤
    await DayRecord.updateMany({ date: { $lte: yesterday }, status: 0 }, { status: 3 })
    // 实习任务状态要每天更新（未开始-进行中， 进行中-已结束）
    const tasks = await Task.find({ status: { $in: [2, 3] } }).lean()
    for (const task of tasks) {
      if (dateCompare(now, task.endAt, true) === 2) {
        await Task.findByIdAndUpdate(task._id, { status: 4 })
      }
      if (task.status === 2 && dateCompare(now, task.startAt, true) >= 1) {
        await Task.findByIdAndUpdate(task._id, { status: 3 })
      }
    }
  } catch (error) {
    console.log(error)
  }
  mongoose.disconnect()
}())
