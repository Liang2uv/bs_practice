const BaseService = require('./baseService')
const ScoreModel = require('../model/Score')
const MainPlanModel = require('../model/MainPlan')
const TaskModel = require('../model/Task')
const DayRecordModel = require('../model/DayRecord')
const NoteModel = require('../model/Note')
const RateModel = require('../model/Rate')
const assert = require('http-assert')
const inflection = require('inflection')
const mongoose = require('mongoose')
class ScoreService extends BaseService {
  constructor() {
    super(ScoreModel)
  }
  /**
   * 获取学生的实习成绩列表（老师用）
   * @param {String} mainPlan 实习计划id
   * @param {String} stuSearch 学生姓名或学号
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async getList(mainPlan, stuSearch = "", page = 1, size = 30) {
    assert(mainPlan, 400, '请求参数错误')
    page = parseInt(page)
    size = parseInt(size)
    const result = await this.model.aggregate([
      {
        $addFields: { student: { $toObjectId: "$student" } }
      },
      {
        $addFields: { mainPlan: { $toObjectId: "$mainPlan" } }
      },
      {
        $lookup: { from: 'adminusers', localField: 'student', foreignField: '_id', as: 'studentInfo' }
      },
      {
        $lookup: { from: 'mainplans', localField: 'mainPlan', foreignField: '_id', as: 'mainPlanInfo' }
      },
      {
        $unwind: "$studentInfo"
      },
      {
        $unwind: "$mainPlanInfo"
      },
      {
        $addFields: { 'studentInfo.school': { $toObjectId: "$studentInfo.school" } }
      },
      {
        $addFields: { 'studentInfo.college': { $toObjectId: "$studentInfo.college" } }
      },
      {
        $addFields: { 'studentInfo.major': { $toObjectId: "$studentInfo.major" } }
      },
      {
        $addFields: { 'studentInfo.grade': { $toObjectId: "$studentInfo.grade" } }
      },
      {
        $addFields: { 'studentInfo.class': { $toObjectId: "$studentInfo.class" } }
      },
      {
        $lookup: { from: 'organizations', localField: 'studentInfo.school', foreignField: '_id', as: 'studentInfo.schoolInfo' }
      },
      {
        $lookup: { from: 'organizations', localField: 'studentInfo.college', foreignField: '_id', as: 'studentInfo.collegeInfo' }
      },
      {
        $lookup: { from: 'organizations', localField: 'studentInfo.major', foreignField: '_id', as: 'studentInfo.majorInfo' }
      },{
        $lookup: { from: 'organizations', localField: 'studentInfo.grade', foreignField: '_id', as: 'studentInfo.gradeInfo' }
      },
      {
        $lookup: { from: 'organizations', localField: 'studentInfo.class', foreignField: '_id', as: 'studentInfo.classInfo' }
      },
      {
        $unwind: "$studentInfo.schoolInfo"
      },
      {
        $unwind: "$studentInfo.collegeInfo"
      },
      {
        $unwind: "$studentInfo.majorInfo"
      },
      {
        $unwind: "$studentInfo.gradeInfo"
      },
      {
        $unwind: "$studentInfo.classInfo"
      },
      {
        $project: {
          "studentInfo.password": 0,
          "studentInfo.openid": 0,
          "mainPlanInfo.files": 0
        }
      },
      {
        $match: {
          $or: [
            { "studentInfo.username": { $regex: stuSearch } },
            { "studentInfo.number": { $regex: stuSearch } }
          ],
          mainPlan: mongoose.Types.ObjectId(mainPlan)
        }
      },
      {
        $sort: { updatedAt: -1 }
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
  /**
   * 获取某个学生的实习成绩
   * @param {String} student 学生id
   */
  async getStudentScore(student) {
    assert(student, 400, '请求参数错误')
    return await this.model.find({ student }).populate('mainPlanInfo', 'name').lean()
  }
  /**
   * 统计一个实习计划的所有学生成绩
   * @param {String} mainPlan 实习计划id
   */
  async calcMainPlan(mainPlan) {
    assert(mainPlan, 400, '请求参数错误')
    const mainPlanModel = await MainPlanModel.findByID(mainPlan)
    const students = await TaskModel.distinct('applicant', { mainPlan, status: 4 })
    for (let i = 0; i < students.length; i++) {
      await this.calcStudent(students[i], null, mainPlanModel)
    }
    return { message: '操作成功' }
  }
  /**
   * 统计一个学生在某个实习计划的成绩
   * @param {String} student 学生id
   * @param {String} mainPlan 实习计划id（可空）
   * @param {String} mainPlanModel 实习计划数据（可空）
   */
  async calcStudent(student, mainPlan, mainPlanModel) {
    assert((student && mainPlan) || (student && mainPlanModel), 400, '请求参数错误')
    if (mainPlan) {
      mainPlanModel = await MainPlanModel.findByID(mainPlan)
    }
    const scoreModel = {
      student,
      mainPlan: mainPlan ? mainPlan : mainPlanModel._id,
      totalScore: 0,
      noteDayScore: 0,
      noteWeekScore: 0,
      noteMonthScore: 0,
      noteSummaryScore: 0,
      clockScore: 0,
      companyScore: 0
    }
    // 1. 找出这个学生在这个实习计划里面创建的所有实习任务
    const taskIds = (await TaskModel.findByFilter({ applicant: student, status: 4 })).map(v => v._id.toString())
    // 2. 实习记录的各个总分(实习某记总分/至少实习某记篇数 * 100分) * 占比 * 总分
    const noteModels = await NoteModel.aggregate([
      {
        $match: { student, task: { $in: taskIds }, status: 1 }
      },
      {
        $group: { _id: '$type', score: { $sum: '$score' } }
      }
    ])
    if (noteModels) {
      for (let i = 0; i < noteModels.length; i++) {
        const type = inflection.camelize(noteModels[i]._id)
        if (mainPlanModel.rate[`note${type}Num`] !== 0 && mainPlanModel.rate[`note${type}Rate`] !== 0) {
          let num = noteModels[i].score / (mainPlanModel.rate[`note${type}Num`] * 100)
          num = num > 1 ? 1 : num
          scoreModel[`note${type}Score`] = Number((num * mainPlanModel.rate[`note${type}Rate`] / 100 * mainPlanModel.rate.totalScore).toFixed(2))
        }
      }
    }
    // 3. 签到总分：(关联计划内的实习任务的所有实际签到数+请假数)/至少签到数 * 占比 * 总分
    if (mainPlanModel.rate.clockRate !== 0 && mainPlanModel.times !== 0) {
      let num = (await DayRecordModel.findByFilter({ student, task: { $in: taskIds }, status: { $in: [1, 2] } })).length / mainPlanModel.times
      num = num > 1 ? 1 : num
      scoreModel.clockScore = Number((num * mainPlanModel.rate.clockRate / 100 * mainPlanModel.rate.totalScore).toFixed(2))
    }
    // 4. 实习单位评价总分：(所有实习单位评价分数平均值 / 100分) * 占比 * 总分
    if (mainPlanModel.rate.companyRate !== 0) {
      const cr = await RateModel.aggregate([
        {
          $match: { student, task: { $in: taskIds }, type: 'officer', status: 1 }
        },
        {
          $group: { _id: null, score: { $avg: '$score' } }
        }
      ])
      if (cr && cr.length > 0) {
        scoreModel.companyScore = Number(( (cr[0].score / 100) * mainPlanModel.rate.companyRate / 100 * mainPlanModel.rate.totalScore).toFixed(2))
      }
    }
    // 5. 总分数
    scoreModel.totalScore = scoreModel.noteDayScore + scoreModel.noteWeekScore + scoreModel.noteMonthScore + scoreModel.noteSummaryScore + scoreModel.clockScore + scoreModel.companyScore
    // 6. 先清除之前已计算过的记录
    await ScoreModel.deleteMany({ student: scoreModel.student, mainPlan: scoreModel.mainPlan })
    // 7. 重新写入
    await ScoreModel.createObj(scoreModel)
    return { message: '操作成功' }
  }
}

module.exports = new ScoreService()