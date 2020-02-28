const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 实习任务表
 */
class TaskSchema extends BaseSchema {
  constructor() {
    super({
      name: { // 名称
        type: String,
        required: true
      },
      mainPlan: { // 所属实习计划id
        type: String,
        required: true
      },
      startAt: {  // 开始时间
        type: Date,
        required: true
      },
      endAt: {  // 结束时间
        type: Date,
        required: true
      },
      company: {  // 实习单位名称
        type: String,
        required: true
      },
      workType: { // 休假类型：double-双休，single-单休，turns-大小周
        type: String,
        enum: ['double', 'single', 'turns'],
        required: true
      },
      workTime: { // 上下班时间：[HH:mm:ss, HH:mm:ss]
        type: [String],
        required: true
      },
      workDays: { // 有效实习天数
        type: Number,
        required: true
      },
      post: { // 实习岗位
        type: String
      },
      salary: { // 实习工资
        type: Number
      },
      address: { // 实习地点/签到地点
        address: { type: String, required: true },  // 位置地址
        latitude: { type: Number, required: true }, // 纬度
        longitude: { type: Number, required: true },  // 经度
        name: { type: String, required: true }, // 位置名称
        city: { type: String, required: true }  // 位置所在城市
      },
      contact: { // 实习联系人
        type: String,
        required: true
      },
      contactPhone: { // 实习联系人电话
        type: String,
        required: true
      },
      teacher: { // 指导老师id
        type: String,
        required: true
      },
      applicant: {  // 申请人
        type: String,
        required: true
      },
      status: { // 状态：0-审核中1-审核未通过2-未开始3-进行中4-已结束
        type: Number,
        required: true
      },
      files: [{ // 实习材料
        name: { type: String, required: true },
        filename: String,
        fileurl: String,
        imgs: [{
          imgname: String,
          imgurl: String
        }]
      }]
    }, 'Task')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new TaskSchema()
schema.virtual('mainPlanInfo', {
  ref: 'MainPlan',
  localField: 'mainPlan',
  foreignField: '_id',
  justOne: true
})
schema.virtual('teacherInfo', {
  ref: 'AdminUser',
  localField: 'teacher',
  foreignField: '_id',
  justOne: true
})
schema.virtual('applicantInfo', {
  ref: 'AdminUser',
  localField: 'applicant',
  foreignField: '_id',
  justOne: true
})


module.exports = mongoose.model('Task', schema)

