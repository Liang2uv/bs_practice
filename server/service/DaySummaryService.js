const BaseService = require('./baseService')
const DaySummaryModel = require('../model/DaySummary')
const OrganizationModel = require('../model/Organization')
const assert = require('http-assert')
const { dataSetTime } = require('../utils/utils')

class DaySummaryService extends BaseService {
  constructor() {
    super(DaySummaryModel)
  }
  /**
   * 获取近七日出勤率
   * @param {String} mainPlan 实习计划id
   */
  async getSevenDayClock(mainPlan) {
    assert(mainPlan, 400, '请求参数错误')
    // 近七日
    const result = []
    for (let i = 7; i > 0; i--) {
      const date = dataSetTime(new Date((new Date()).getTime() - i * 24 * 3600 * 1000))
      const item = {
        date,
        clockRate: 0
      }
      const ds = await this.model.findOne({ mainPlan, date })
      if (ds) {
        item.clockRate = ds.mainPlanClock.clockRate
      }
      result.push(item)
    }
    return result
  }
  /**
   * 获取某一日的出勤情况（包括班级出勤情况）
   * @param {String} mainPlan 实习计划id
   * @param {String} date 日期yyyy-MM-dd HH:mm:ss
   */
  async getOneDayClock(mainPlan, date) {
    assert(mainPlan && date, 400, '请求参数错误')
    date = dataSetTime(new Date(date))
    const result = await this.model.findOne({ mainPlan, date }).lean()
    assert(result, 422, '当前查询日期的数据暂未统计')
    // 添加上班级信息
    for (let i = 0; i < result.classClock.length; i++) {
      result.classClock[i].classInfo = await OrganizationModel.findById(result.classClock[i].class).lean()
    }
    return result
  }
}

module.exports = new DaySummaryService()