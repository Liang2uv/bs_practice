const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 实习评价表
 */
class RateSchema extends BaseSchema {
  constructor() {
    super({
      content: {  // 评价意见
        type: String
      },
      task: { // 实习任务id
        type: String,
        required: true
      },
      student: { // 学生id
        type: String,
        required: true
      },
      rater: { // 评价人id
        type: String,
        required: true
      },
      score: {  // 成绩（0-100）
        type: Number,
        default: 0
      },
      type: { // 类型：officer-实习单位评价teacher-指导老师评价
        type: String,
        required: true,
        enum: ['officer', 'teacher']
      },
      status: { // 状态：0-待评价1-已评价
        type: Number,
        required: true
      }
    }, 'Rate')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new RateSchema()

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
schema.virtual('raterInfo', {
  ref: 'AdminUser',
  localField: 'rater',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Rate', schema)

