const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

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
    type: String
  },
  role: { // 角色
    type: String,
    enum: ['superadmin', 'admin', 'teacher', 'student']
  },
  school: { // 学校
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'School'
  },
  status: { // 状态0-禁用1-启用
    type: Number,
    default: 1
  }
})

module.exports = mongoose.model('AdminUser', schema)

