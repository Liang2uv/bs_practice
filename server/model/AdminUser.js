const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const BaseSchema = require('./BaseSchema')

/**
 * 账号信息表
 */
class AdminUserSchema extends BaseSchema {
  constructor() {
    super({
      phone: { // 手机号
        type: String,
        required: true
      },
      password: { // 密码
        type: String,
        select: false,
        set(val) {
          return bcryptjs.hashSync(val, 10)
        },
        required: true
      },
      username: { // 用户名
        type: String,
        required: true
      },
      role: { // 角色
        type: String,
        required: true,
        enum: ['superadmin', 'admin', 'teacher', 'student']
      },
      status: { // 状态0-禁用1-启用
        type: Number,
        default: 1
      },
      openid: { // 小程序openid
        type: String
      },
      number: { // 学号/工号
        type: String
      },
      school: { // 学校
        type: String
      },
      college: { // 学院
        type: String
      },
      grade: { // 年级
        type: String
      },
      major: { // 专业
        type: String
      },
      class: { // 班级
        type: String
      },
      avatar: { // 头像
        type: String,
        default: 'https://practice-liangbb-1300060132.cos.ap-guangzhou.myqcloud.com/mp/big81005.jpg'
      }
    }, 'AdminUser')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new AdminUserSchema()
schema.virtual('schoolInfo', {
  ref: 'Organization',
  localField: 'school',
  foreignField: '_id',
  justOne: true
})
schema.virtual('collegeInfo', {
  ref: 'Organization',
  localField: 'college',
  foreignField: '_id',
  justOne: true
})
schema.virtual('gradeInfo', {
  ref: 'Organization',
  localField: 'grade',
  foreignField: '_id',
  justOne: true
})
schema.virtual('majorInfo', {
  ref: 'Organization',
  localField: 'major',
  foreignField: '_id',
  justOne: true
})
schema.virtual('classInfo', {
  ref: 'Organization',
  localField: 'class',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('AdminUser', schema)

