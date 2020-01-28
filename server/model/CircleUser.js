const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 圈子-用户中间表
 */
class CircleUserSchema extends BaseSchema {
  constructor() {
    super({
      circle: {  // 圈子id
        type: String,
        required: true
      },
      user: { // 用户id
        type: String,
        required: true
      },
      userRole: { // 用户在这个圈子里的角色
        type: String,
        required: true,
        enum: ['student', 'teacher']
      },
      status: { // 进圈状态：0-待审核1-已进入
        type: Number,
        required: true
      }
    }, 'CircleUser')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new CircleUserSchema()

schema.virtual('circleInfo', {
  ref: 'Circle',
  localField: 'circle',
  foreignField: '_id',
  justOne: true
})

schema.virtual('userInfo', {
  ref: 'AdminUser',
  localField: 'user',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('CircleUser', schema)

