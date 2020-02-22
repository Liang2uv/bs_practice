const TaskModel = require('../model/Task')
const DayOffService = require('./DayOffService')
const CircleUserService = require('./CircleUserService')
/**
 * 特殊的业务查询
 */
class OtherService {
  /**
   * 获取待审核个数（后台首页展示需要）
   * @param {String} teacher 教师id
   */
  async getReviewSum(teacher) {
    const taskReviewNum = await TaskModel.find({ teacher, status: 0 }).countDocuments() || 0
    const dayOffReviewNum = (await DayOffService.getList(teacher, '', 0)).total || 0
    const circleReviewNum = (await CircleUserService.getReviewList(teacher, '', 0)).total || 0
    return {
      taskReviewNum,
      dayOffReviewNum,
      circleReviewNum
    }
  }
}
module.exports = new OtherService()