const BaseService = require('./BaseService')
const MainPlanModel = require('../model/MainPlan')
const mongoose = require('mongoose')
const assert = require('http-assert')
class MainPlanService extends BaseService {
  constructor() {
    super(MainPlanModel)
  }
  /**
   * 查询某个老师需要指导的实习计划id
   * @param {String} teacher 教师id
   */
  async getListForTeacher(teacher) {
    assert(teacher, 400, '请求参数错误')
    return await MainPlanModel.find({ teacher: { $in: [mongoose.Types.ObjectId(teacher)] } })
  }
}

module.exports = new MainPlanService()