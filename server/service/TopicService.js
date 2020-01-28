const BaseService = require('./baseService')
const TopicModel = require('../model/Topic')
const CircleTopicModel = require('../model/CircleTopic')
class TopicService extends BaseService {
  constructor() {
    super(TopicModel)
  }
  /**
   * 创建帖子
   * @param {Object} data 添加的数据
   */
  async addTopic(data) {
    const model = await this.model.createObj(data)
    const circleTopicData = data.circles.map(v => {
      return {
        circle: v,
        user: data.user,
        topic: model._id.toString()
      }
    })
    await CircleTopicModel.insertMany(circleTopicData)
    return model
  }
}

module.exports = new TopicService()