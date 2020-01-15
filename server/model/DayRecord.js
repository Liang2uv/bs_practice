const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 工作日记录表
 */
class DayRecordSchema extends BaseSchema {
  constructor() {
    super({
      date: { // 日期
        type: Date,
        required: true
      },
      task: { // 实习任务id
        type: String,
        required: true
      },
      student: { // 学生id
        type: String,
        required: true
      },
      status: { // 记录状态：0-未签到1-已签到2-已请假
        type: Number,
        required: true
      }
    }, 'DayRecord')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new DayRecordSchema()

schema.virtual('taskInfo', {
  ref: 'Task',
  localField: 'task',
  foreignField: '_id',
  justOne: true
})
schema.virtual('studentInfo', {
  ref: 'AdminUser',
  localField: 'student',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('DayRecord', schema)

