const BaseService = require('./baseService')
const RateModel = require('../model/Rate')
const assert = require('http-assert')
class RateService extends BaseService {
  constructor() {
    super(RateModel)
  }
  async invite(student, rater, task, type) {
    assert(student && rater && task && type, 422, '请求参数错误')
    const ex = await this.model.findOne({ task })
    assert(!ex, 422, '该任务正在评价，无需重复邀请')
    const model = {
      task,
      student,
      rater,
      type,
      status: 0
    }
    await this.model.createObj(model)
    return {
      message: '邀请成功'
    }
  }
}

module.exports = new RateService()