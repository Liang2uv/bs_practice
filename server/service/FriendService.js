const BaseService = require('./BaseService')
const FriendModel = require('../model/Friend')
const assert = require('http-assert')
class FriendService extends BaseService {
  constructor() {
    super(FriendModel)
  }
  /**
   * 获取我的好友列表
   * @param {String} userId 用户Id
   */
  async getList(userId) {
    const models = await this.model.find({ $or: [{ fromUser: userId, status: 1 }, { toUser: userId, status: 1 }] }).populate('toUserInfo', 'username avatar role').populate('fromUserInfo', 'username avatar role').lean()
    models.forEach(item => {
      if (item.fromUser === userId) {
        item.userInfo = item.toUserInfo
      } else {
        item.userInfo = item.fromUserInfo
      }
    })
    return models
  }
  /**
   * 添加好友
   * @param {String} fromUser 添加人id
   * @param {String} toUser 被添加人id
   * @param {String} remark 附带消息
   */
  async addFriend(fromUser, toUser, remark) {
    assert(fromUser !== toUser, 422, '不可添加自己为好友')
    const ex = await FriendModel.findOne({ $or: [{ fromUser, toUser }, { fromUser: toUser, toUser: fromUser }] })
    assert(!ex, 422, '已申请，请勿重复申请添加')
    const model = {
      fromUser,
      toUser,
      remark,
      status: 0
    }
    await FriendModel.createObj(model)
    return { message: '添加成功' }
  }
}

module.exports = new FriendService()