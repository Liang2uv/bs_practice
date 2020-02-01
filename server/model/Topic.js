const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 帖子表
 */
class TopicSchema extends BaseSchema {
  constructor() {
    super({
      content: {  // 内容
        type: String,
        required: true
      },
      imgs: [String], // 图片
      user: { // 用户id
        type: String,
        required: true
      },
      tags: [String], // 标签
      type: { // 类型：note-实习记录notice-公告normal-一般帖子
        type: String,
        required: true,
        enum: ['note', 'notice', 'normal']
      },
      comments: { // 评论数
        type: Number,
        default: 0
      },
      views: {  // 浏览数
        type: Number,
        default: 0
      }
    }, 'Topic')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new TopicSchema()

schema.virtual('userInfo', {
  ref: 'AdminUser',
  localField: 'user',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Topic', schema)

