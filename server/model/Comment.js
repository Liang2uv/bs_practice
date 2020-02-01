const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 帖子评论表
 */
class CommentSchema extends BaseSchema {
  constructor() {
    super({
      topic: {  // 帖子id
        type: String,
        required: true
      },
      content: { // 评论内容
        type: String,
        required: true
      },
      layer: { // 评论层级：1-1级,2-2级
        type: String,
        default: '1'
      },
      pid: {  // 1级评论id，如果是2级评论需要有此字段
        type: String
      },
      fromUser: { // 评论人id
        type: String,
        required: true
      },
      toUser: { // 评论对象id
        type: String,
        required: true
      }
    }, 'Comment')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new CommentSchema()

schema.virtual('topicInfo', {
  ref: 'Topic',
  localField: 'topic',
  foreignField: '_id',
  justOne: true
})
schema.virtual('pidInfo', {
  ref: 'Comment',
  localField: 'pid',
  foreignField: '_id',
  justOne: true
})
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

module.exports = mongoose.model('Comment', schema)

