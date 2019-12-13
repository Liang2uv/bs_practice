const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

/**
 * 账号信息表
 */

const schema = new mongoose.Schema({
  phone: { // 手机号
    type: String,
    required: true
  },
  password: { // 密码
    type: String,
    select: false,
    set(val) {
      return bcryptjs.hashSync(val, 10)
    },
    required: true
  },
  username: { // 用户名
    type: String,
    required: true
  },
  role: { // 角色
    type: String,
    required: true,
    enum: ['superadmin', 'admin', 'teacher', 'student']
  },
  status: { // 状态0-禁用1-启用
    type: Number,
    default: 1
  },
  number: { // 学号/工号
    type: String
  },
  school: { // 学校
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'School'
  },
  college: { // 学院
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Organization'
  },
  grade: { // 年级
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Organization'
  },
  major: { // 专业
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Organization'
  },
  class: { // 班级
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Organization'
  }
})

module.exports = mongoose.model('AdminUser', schema)

