const mongoose = require('mongoose')

/**
 * 组织架构表：学校-学院-年级-专业-班级
 */

const schema = new mongoose.Schema({
  name: { // 名称
    type: String,
    required: true
  },
  pid: { // 上一级（学校无pid属性）
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Organization'
  },
  path: { // 路径（以,分隔，前后都有，具体到本model的id）
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
})

module.exports = mongoose.model('Organization', schema)