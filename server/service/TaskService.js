const BaseService = require('./baseService')
const TaskModel = require('../model/Task')
const DayRecordModel = require('../model/DayRecord')
const MainPlanModel = require('../model/MainPlan')
const { getWorkDays } = require('../utils/utils')
const assert = require('http-assert')

class TaskService extends BaseService {
  constructor() {
    super(TaskModel)
  }
  /**
   * 获取有效的实习天数
   * @param {String} startAt 开始实习时间
   * @param {String} endAt 结束实习时间
   * @param {String} mainPlan 所属实习计划id
   */
  async getValidDays(startAt, endAt, mainPlan) {
    assert(startAt && endAt && mainPlan, 400, '请求参数错误')
    const mainPlanInfo = await MainPlanModel.findByID(mainPlan)
    startAt = new Date(startAt)
    endAt = new Date(endAt)
    const mainPlanStartAt = new Date(mainPlanInfo.startAt)
    const mainPlanEndAt = new Date(mainPlanInfo.endAt)
    const trueStartAt = startAt >= mainPlanStartAt ? startAt : mainPlanStartAt
    if (trueStartAt > mainPlanEndAt) {
      return { workDays: 0, days: [] }
    }
    const trueEndAt = endAt <= mainPlanEndAt ? endAt : mainPlanEndAt
    if (endAt < mainPlanStartAt) {
      return { workDays: 0, days: [] }
    }
    const days = getWorkDays(trueStartAt.getTime(), trueEndAt.getTime())
    return { workDays: days.length, days }
  }
  /**
   * 添加实习任务
   * @param {Object} model 要添加的数据
   */
  async addTask(model) {
    const result = await this.model.createObj(model)
    const days = getWorkDays(model.startAt, model.endAt)
    const dayRecords = days.map(v => {
      return {
        date: v,
        task: result._id,
        student: model.applicant,
        status: 0
      }
    })
    DayRecordModel.insertMany(dayRecords)
    return result
  }
}

module.exports = new TaskService()