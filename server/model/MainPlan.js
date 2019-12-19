const mongoose = require('mongoose')

/**
 * 实习总计划表
 */

const schema = new mongoose.Schema({
  name: { // 名称
    type: String,
    required: true
  },
  school: { // 所属学校
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'School',
    required: true
  },
  startAt: {  // 开始时间
    type: Date,
    required: true
  },
  endAt: {  // 截止时间
    type: Date,
    required: true
  },
  times: { // 至少实习时间（天）
    type: Number,
    required: true
  },
  teacher: [{ // 指导老师
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'AdminUser',
    required: true
  }]
}, {
  timestamps: true
})


module.exports = mongoose.model('MainPlan', schema)