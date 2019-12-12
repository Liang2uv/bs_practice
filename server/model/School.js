const mongoose = require('mongoose')

/**
 * 学校表
 */

const schema = new mongoose.Schema({
  name: { // 学校名称
    type: String,
    required: true
  },
  code: { // 学校代码
    type: String,
    required: true
  }
})

module.exports = mongoose.model('School', schema)