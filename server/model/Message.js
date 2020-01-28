const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 消息通知表
 */
class MessageSchema extends BaseSchema {
  constructor() {
    super({
      content: {  // 内容
        type: String,
        required: true
      },
      send: { // 发送人
        type: String
      },
      receive: {  // 接收人
        type: String,
        required: true
      },
      type: { // 消息类型: system-系统消息warning-预警消息
        type: String,
        required: true,
        enum: ['system', 'warning']
      },
      status: { // 消息状态：0-未读1-已读
        type: Number,
        required: true,
        default: 0
      }
    }, 'Message')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new MessageSchema()

schema.virtual('sendInfo', {
  ref: 'AdminUser',
  localField: 'send',
  foreignField: '_id',
  justOne: true
})
schema.virtual('receiveInfo', {
  ref: 'AdminUser',
  localField: 'receive',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Message', schema)

