const BaseService = require('./baseService')
const TaskModel = require('../model/Task')
const DayRecordModel = require('../model/DayRecord')
const MainPlanModel = require('../model/MainPlan')
const AdminUserModel = require('../model/AdminUser')
const { getWorkDays, dateCrossList, dateCompare, dataSetTime } = require('../utils/utils')
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
    // 得到的是有效的实习工作日
    const days = getWorkDays(trueStartAt.getTime(), trueEndAt.getTime())
    return { workDays: days.length, days }
  }
  /**
   * 添加实习任务
   * @param {Object} model 要添加的数据
   */
  async addTask(model) {
    // 判断该任务的起始日期是否与其他任务有交叠，不允许有重叠
    const taskList = await this.model.findByFilter({ applicant: model.applicant })
    if (dateCrossList([model.startAt, model.endAt], taskList.map(v => [v.startAt, v.endAt]))) {
      assert(false, 422, '创建出错：不允许与其他任务的日期有重叠')
    }
    const result = await this.model.createObj(model)
    const applicantInfo = await AdminUserModel.findByID(model.applicant)
    // 得到的是实际工作日
    const days = getWorkDays(model.startAt, model.endAt)
    const dayRecords = days.map(v => {
      return {
        date: v,
        task: result._id,
        mainPlan: result.mainPlan,
        student: model.applicant,
        class: applicantInfo.class,
        status: dateCompare(new Date(), v, true) < 2? 0 : 3
      }
    })
    await DayRecordModel.insertMany(dayRecords)
    return result
  }
  /**
   * 获取当前实习任务信息
   */
  async getCurrentTask(userId) {
    const startNow = dataSetTime(new Date(), '23')
    const endNow = dataSetTime(new Date())
    // 获取任务
    const task = await this.model.findOne({ applicant: userId, status: 3, startAt: { $lte: startNow }, endAt: { $gte: endNow } }).lean()
    if (task) {
      // 获取当前的工作日信息
      const day = await DayRecordModel.findOne({ date: endNow, student: userId })
      task.day = day
      // 获取所有的工作日信息
      const days = await DayRecordModel.find({ task: task._id }).lean()
      // 统计已经实习的天数和签到天数
      const [practiceDays, clockDays] = days.reduce((arr, item) => {
        dateCompare(new Date(), item.date, true) >= 1 ? ++arr[0] : arr[0]
        item.status === 1 ? ++arr[1] : arr[1]
        return arr
      }, [0, 0])
      task.practiceDays = practiceDays
      task.clockDays = clockDays
    }
    return task
  }
}

module.exports = new TaskService()