const mongoose = require('mongoose')

/**
 * 专业表
 */

const schema = new mongoose.Schema({
  name: { // 专业名称
    type: String,
    required: true
  },
  college: { // 所属学院
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'College',
    required: true
  }
})

module.exports = mongoose.model('Major', schema)