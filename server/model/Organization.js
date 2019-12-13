const mongoose = require('mongoose')

/**
 * 组织架构表：学院-年级-专业-班级
 */

const schema = new mongoose.Schema({
  name: { // 名称
    type: String,
    required: true
  },
  pid: { // 上一级
    type: String,
    required: true
  },
  path: { // 路径（以,分隔，前后都有）
    type: String,
    required: true
  },
  layer: { // 层级
    type: Number,
    required: true
  },
  type: { // 类型：院系，专业，年级，班级
    type: String,
    required: true,
    enum: ['college', 'grade', 'major', 'class']
  }
})

module.exports = mongoose.model('Organization', schema)