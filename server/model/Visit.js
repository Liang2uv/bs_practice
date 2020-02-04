const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 实习走访记录表
 */
class VisitSchema extends BaseSchema {
  constructor() {
    super({
      teacher: { // 教师id
        type: String,
        required: true
      },
      student: [{ // 被访问的学生id集合
        type: mongoose.Types.ObjectId,
        ref: 'AdminUser'
      }],
      date: {  // 走访时间
        type: Date,
        required: true
      },
      content: {  // 走访心得
        type: String,
        required: true
      },
      imgs: [String]  // 走访照片集合
    }, 'Visit')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new VisitSchema()
schema.virtual('teacherInfo', {
  ref: 'AdminUser',
  localField: 'teacher',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Visit', schema)

