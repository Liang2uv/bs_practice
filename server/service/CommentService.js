const BaseService = require('./baseService')
const CommentModel = require('../model/Comment')
const TopicModel = require('../model/Topic')
const MessageModel = require('../model/Message')
const assert = require('http-assert')
class CommentService extends BaseService {
  constructor() {
    super(CommentModel)
  }
  /**
   * 获取某个帖子的评论列表
   * @param {String} topic 帖子id
   */
  async getList(topic) {
    assert(topic, 400, '请求参数错误')
    // 获取帖子详情
    const topicDetail = await TopicModel.findOne({ _id: topic }).populate('userInfo', 'username avatar role').lean()
    // 获取一级评论列表
    const c1 = await this.model.find({ topic, layer: '1' }).populate('fromUserInfo', 'username avatar role').populate('toUserInfo', 'username avatar role').lean()
    // 获取二级评论列表
    for (let i = 0; i < c1.length; i++) {
      const c2 = await this.model.find({ topic, pid: c1[i]._id.toString(), layer: '2' }).populate('fromUserInfo', 'username avatar role').populate('toUserInfo', 'username avatar role').lean()
      c1[i].reply = c2
      c1[i].replyTotal = c2.length
    }
    return { topic: topicDetail, comment: c1 }
  }
  /**
   * 添加评论
   * @param {Object} data 添加的数据
   */
  async addComment(data) {
    // 插入数据
    let model = await this.model.createObj(data)
    model = await this.model.findOne({ _id: model._id }).populate('topicInfo').populate('fromUserInfo', 'username').populate('toUserInfo', 'username').lean()
    // 帖子评论数+1
    await TopicModel.findByIdAndUpdate(model.topic, { comments: model.topicInfo.comments ? model.topicInfo.comments + 1 : 1 }, { new: true })
    // 通知消息
    if (model.fromUser !== model.toUser) {
      const msg = {
        content: `${model.fromUserInfo.username}在帖子“${model.topicInfo.content.slice(0, 20)}”中回复了您：${model.content}`,
        send: model.fromUser,
        receive: model.toUser,
        type: 'comment',
        status: 0,
        remark: model.topic
      }
      await MessageModel.createObj(msg)
    }
    return { message: '评论成功' }
  }
}

module.exports = new CommentService()