const mongoose = require('mongoose')

/**
 * 学院表
 */

const schema = new mongoose.Schema({
  name: { // 学院名称
    type: String,
    required: true
  },
  school: { // 所属学校
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'School',
    required: true
  }
})

module.exports = mongoose.model('College', schema)