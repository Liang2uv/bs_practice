const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 组织结构表：学校-学院-年级-专业-班级
 */
class OrganizationSchema extends BaseSchema {
  constructor() {
    super({
      name: { // 名称
        type: String,
        required: true
      },
      pid: { // 上一级（学校无pid属性）
        type: String
      },
      path: { // 路径（以,分隔，前后都有，具体到父级model的id）
        type: String,
        required: true
      },
      layer: { // 层级（从0开始）
        type: Number,
        required: true
      },
      type: { // 类型：学校，院系，专业，年级，班级
        type: String,
        required: true,
        enum: ['school','college', 'grade', 'major', 'class']
      }
    }, 'Organization')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new OrganizationSchema()

schema.virtual('pidInfo', {
  ref: 'Organization',
  localField: 'pid',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Organization', schema)

