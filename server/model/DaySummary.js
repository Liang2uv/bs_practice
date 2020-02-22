const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 每日统计记录表
 */
class DaySummarySchema extends BaseSchema {
  constructor() {
    super({
      date: { // 日期
        type: Date,
        required: true
      },
      mainPlan: { // 实习计划id
        type: String,
        required: true
      },
      mainPlanClock: { // 当前日期的所有学生出勤情况
        clockRate: { // 出勤率
          type: Number,
          required: true
        },
        noClockNum: { // 待签到人数
          type: Number,
          required: true
        },
        clockNum: { // 已签到人数
          type: Number,
          required: true
        },
        dayOffNum: {  // 已请假人数
          type: Number,
          required: true
        },
        absenceNum: { // 缺勤人数
          type: Number,
          required: true
        },
      },
      classClock: [{  // 当前日期的班级出勤情况
        class: { type: String, required: true }, // 班级id
        clockRate: { // 出勤率
          type: Number,
          required: true
        },
        noClockNum: { // 待签到人数
          type: Number,
          required: true
        },
        clockNum: { // 已签到人数
          type: Number,
          required: true
        },
        dayOffNum: {  // 已请假人数
          type: Number,
          required: true
        },
        absenceNum: { // 缺勤人数
          type: Number,
          required: true
        }
      }]
    }, 'DaySummary')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new DaySummarySchema()

schema.virtual('mainPlanInfo', {
  ref: 'MainPlan',
  localField: 'mainPlan',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('DaySummary', schema)

