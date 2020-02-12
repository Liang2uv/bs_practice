const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 实习总计划表
 */
class MainPlanSchema extends BaseSchema {
  constructor() {
    super({
      name: { // 名称
        type: String,
        required: true
      },
      school: { // 所属学校
        type: String,
        required: true
      },
      startAt: {  // 开始时间
        type: Date,
        required: true
      },
      endAt: {  // 截止时间
        type: Date,
        required: true
      },
      times: { // 至少实习时间（天）
        type: Number,
        required: true
      },
      teacher: [{ // 指导老师
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'AdminUser',
        required: true
      }],
      files: [{ // 实习材料
        name: { type: String, required: true },
        filename: { type: String },
        fileurl: { type: String }
      }],
      rate: {  // 考评机制
        totalScore: { type: Number, default: 0 }, // 总分
        noteDayNum: { type: Number, default: 0 },  // 至少实习日记篇数
        noteWeekNum: { type: Number, default: 0 },  // 至少实习周记篇数
        noteMonthNum: { type: Number, default: 0 },  // 至少实习月记篇数
        noteSummaryNum: { type: Number, default: 0 },  // 至少实习总结篇数
        clockRate: { type: Number, default: 0 },  // 签到占比
        noteDayRate: { type: Number, default: 0 },  // 实习日记占比
        noteWeekRate: { type: Number, default: 0 },  // 实习周记占比
        noteMonthRate: { type: Number, default: 0 },  // 实习月记占比
        noteSummaryRate: { type: Number, default: 0 },  // 实习总结占比
        companyRate: { type: Number, default: 0 },  // 实习单位评价占比
      }
    }, 'MainPlan')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new MainPlanSchema()
schema.virtual('schoolInfo', {
  ref: 'Organization',
  localField: 'school',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('MainPlan', schema)

