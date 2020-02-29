const BaseService = require('./BaseService')
const MessageModel = require('../model/Message')
const assert = require('http-assert')
const mongoose = require('mongoose')
class MessageService extends BaseService {
  constructor() {
    super(MessageModel)
  }
  /**
   * 批量修改消息状态
   * @param {Number} status 状态
   * @param {Array} ids 消息的id集合
   */
  async bulkUpdateStatus(status, ids) {
    assert(status && ids, 400, '请求参数错误')
    status = parseInt(status)
    ids = ids.map(v => mongoose.Types.ObjectId(v))
    await MessageModel.updateMany({ _id: { $in: ids } }, { status })
    return { message: '修改成功' }
  }
}

module.exports = new MessageService()