const BaseService = require('./baseService')
const RateModel = require('../model/Rate')
const assert = require('http-assert')
class RateService extends BaseService {
  constructor() {
    super(RateModel)
  }
  /**
   * 邀请考评
   * @param {String} student 学生id
   * @param {String} rater 考评人id
   * @param {String} task 实习任务id
   * @param {String} type 考评类型：officer/teacher
   */
  async invite(student, rater, task, type) {
    assert(student && rater && task && type, 422, '请求参数错误')
    const ex = await this.model.findOne({ task, rater })
    assert(!ex, 422, '该任务正在评价，无需重复邀请')
    // 先删除之前已经邀请过的，防止出错，因为一个任务只能有一个实习单位评价，重新邀请的话之前的邀请要作废
    await RateModel.deleteMany({ task })
    // 添加
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