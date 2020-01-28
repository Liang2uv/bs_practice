const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 实习记录表
 */
class NoteSchema extends BaseSchema {
  constructor() {
    super({
      content: {  // 内容
        type: String,
        required: true
      },
      imgs: [String], // 图片
      task: { // 实习任务id
        type: String,
        required: true
      },
      student: { // 学生id
        type: String,
        required: true
      },
      tags: [String], // 标签
      score: {  // 老师评分（0-5）
        type: Number,
        default: 0
      },
      date: { // 关联日期
        type: Date,
        required: true
      },
      type: { // 类型
        type: String,
        required: true,
        enum: ['day', 'week', 'month', 'summary']
      },
      status: { // 状态：0-待审核1-已审核
        type: Number,
        required: true
      }
    }, 'Note')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new NoteSchema()

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

module.exports = mongoose.model('Note', schema)

