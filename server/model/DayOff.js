const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 请假记录表
 */
class DayOffSchema extends BaseSchema {
  constructor() {
    super({
      startAt: {  // 开始时间
        type: Date,
        required: true
      },
      endAt: {  // 结束时间
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
      reason: {  // 请假理由
        type: String,
        required: true
      },
      files: [{ // 证明材料
        filename: String, // 文件名
        fileurl: String // 文件存储路径
      }],
      status: { // 状态：0-待审核1-审核通过2-审核不通过
        type: Number,
        required: true
      }
    }, 'DayOff')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new DayOffSchema()

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

module.exports = mongoose.model('DayOff', schema)

