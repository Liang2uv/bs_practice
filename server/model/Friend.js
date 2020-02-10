const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 好友表
 */
class FriendSchema extends BaseSchema {
  constructor() {
    super({
      fromUser: { // 添加人id
        type: String,
        required: true
      },
      toUser: { // 被添加人id
        type: String,
        required: true
      },
      remark: { // 附加消息
        type: String
      },
      status: { // 状态：0-待审核1-已添加
        type: Number,
        required: true
      }
    }, 'Friend')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new FriendSchema()

schema.virtual('fromUserInfo', {
  ref: 'AdminUser',
  localField: 'fromUser',
  foreignField: '_id',
  justOne: true
})
schema.virtual('toUserInfo', {
  ref: 'AdminUser',
  localField: 'toUser',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Friend', schema)

