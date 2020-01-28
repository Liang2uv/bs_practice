const mongoose = require('mongoose')
const BaseSchema = require('./BaseSchema')

/**
 * 圈子表
 */
class CircleSchema extends BaseSchema {
  constructor() {
    super({
      name: {  // 名称
        type: String,
        required: true
      },
      avatar: { // 圈子头像
        type: String,
        default: 'https://img.zcool.cn/community/031191c5db0fbe3a8012163babf39e8.jpg@80w_80h_1c_1e_1o_100sh.jpg'
      },
      desc: { // 圈子描述
        type: String
      },
      enterWay: { // 进圈审核方式(0-直接进入、1-审核进入)
        type: Number,
        required: true
      },
      creater: {  // 创建人id
        type: String,
        required: true
      },
      status: { // 状态：0-停用1-启用
        type: Number,
        default: 1
      }
    }, 'Circle')
    /********************该Schema特有的方法*************************/
    let special = {}
    /*********************合并特有方法和公共方法*********************/
    this.static = Object.assign(this.static, special)
  }
}

const schema = new CircleSchema()

schema.virtual('createrInfo', {
  ref: 'AdminUser',
  localField: 'creater',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('Circle', schema)

