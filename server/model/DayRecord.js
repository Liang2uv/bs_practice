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
      mainPlan: { // 实习计划id
        type: String,
        required: true
      },
      student: { // 学生id
        type: String,
        required: true
      },
      class: {  // 学生所在班级id
        type: String,
        required: true
      },
      status: { // 记录状态：0-待签到1-已签到2-已请假3-缺勤
        type: Number,
        required: true
      },
      clock: {  // 签到信息
        latitude: { type: Number }, // 纬度
        longitude: { type: Number },  // 经度
        distance: { type: Number }  // 距离签到地点的距离（m）
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
schema.virtual('mainPlanInfo', {
  ref: 'MainPlan',
  localField: 'mainPlan',
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

