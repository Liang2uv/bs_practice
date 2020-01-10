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
      }]
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

