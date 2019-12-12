const mongoose = require('mongoose')

/**
 * 组织架构表：学院-专业-年级-班级
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
  type: { // 类型：院系，专业，年级，班级
    type: String,
    required: true,
    enum: ['college', 'major', 'grade', 'class']
  }
})

module.exports = mongoose.model('Organization', schema)