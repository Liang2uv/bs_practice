const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 圈子-帖子中间表
 */
class CircleTopicSchema extends BaseSchema {
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
      topic: { // 帖子id
        type: String,
        required: true
      }
    }, 'CircleTopic')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new CircleTopicSchema()

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

schema.virtual('topicInfo', {
  ref: 'Topic',
  localField: 'topic',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('CircleTopic', schema)

