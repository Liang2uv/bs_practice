const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 学生成绩表
 */
class ScoreSchema extends BaseSchema {
  constructor() {
    super({
      student: {  // 学生id
        type: String,
        required: true
      },
      mainPlan: {  // 实习计划id
        type: String,
        required: true
      },
      totalScore: { // 总分
        type: Number,
        default: 0
      },
      noteDayScore: { // 实习日记总分
        type: Number,
        default: 0
      },
      noteWeekScore: { // 实习周记总分
        type: Number,
        default: 0
      },
      noteMonthScore: { // 实习月记总分
        type: Number,
        default: 0
      },
      noteSummaryScore: { // 实习总结总分
        type: Number,
        default: 0
      },
      clockScore: { // 签到总分
        type: Number,
        default: 0
      },
      companyScore: { // 实习单位评价总分
        type: Number,
        default: 0
      }
    }, 'Score')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new ScoreSchema()

schema.virtual('studentInfo', {
  ref: 'AdminUser',
  localField: 'student',
  foreignField: '_id',
  justOne: true
})
schema.virtual('mainPlanInfo', {
  ref: 'MainPlan',
  localField: 'mainPlan',
  foreignField: '_id',
  justOne: true
})


module.exports = mongoose.model('Score', schema)

