const BaseService = require('./BaseService')
const DayRecordModel = require('../model/DayRecord')
const assert = require('http-assert')
class DayRecordService extends BaseService {
  constructor() {
    super(DayRecordModel)
  }
  /**
 * 获取学生的签到列表（老师用）
 * @param {String} teaId 老师id
 * @param {String} stuSearch 学生姓名或学号
 * @param {Number} status 状态
 * @param {Number} page 页码
 * @param {Number} size 分页大小
 */
  async getClockList(teaId, stuSearch = "", status = { $in: [0, 1, 2, 3] }, page = 1, size = 30) {
    assert(teaId, 400, '请求参数错误')
    page = parseInt(page)
    size = parseInt(size)
    status = typeof(status) === 'string' ? parseInt(status) : status
    const result = await DayRecordModel.aggregate([
      {
        $addFields: { student: { $toObjectId: "$student" } }
      },
      {
        $addFields: { task: { $toObjectId: "$task" } }
      },
      {
        $lookup: { from: 'adminusers', localField: 'student', foreignField: '_id', as: 'studentInfo' }
      },
      {
        $lookup: { from: 'tasks', localField: 'task', foreignField: '_id', as: 'taskInfo' }
      },
      {
        $unwind: "$studentInfo"
      },
      {
        $unwind: "$taskInfo"
      },
      {
        $project: {
          "studentInfo.password": 0,
          "studentInfo.openid": 0,
          "taskInfo.files": 0,
        }
      },
      {
        $match: {
          $or: [
            { "studentInfo.username": { $regex: stuSearch } },
            { "studentInfo.number": { $regex: stuSearch } }
          ],
          status: status,
          "taskInfo.teacher": { $regex: teaId }
        }
      },
      {
        $sort: {createdAt: -1}
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          list: { $push: "$$ROOT" }
        }
      },
      {
        $addFields: {
          list: { $slice: ['$list', size * (page - 1), size] }
        }
      },
      {
        $project: { _id: 0 }
      }
    ])
    return result.length === 0 ? { total: 0, list: [] } : result[0]
  }
}

module.exports = new DayRecordService()