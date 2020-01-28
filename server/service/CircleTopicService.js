const BaseService = require('./baseService')
const CircleTopicModel = require('../model/CircleTopic')
class CircleTopicService extends BaseService {
  constructor() {
    super(CircleTopicModel)
  }
}

module.exports = new CircleTopicService()