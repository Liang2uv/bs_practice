const mongoose = require('mongoose')

/**
 * 班级表
 */

const schema = new mongoose.Schema({
  name: { // 班级名称
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  major: { // 所属专业
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Major',
    required: true
  }
})

module.exports = mongoose.model('StuClass', schema, 'stuclasses')