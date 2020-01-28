const BaseService = require('./baseService')
const CircleUserModel = require('../model/CircleUser')
const CircleModel = require('../model/Circle')
const AdminUserModel = require('../model/AdminUser')
const { findAddUpdateDelete } = require('../utils/array')
const assert = require('http-assert')
const mongoose = require('mongoose')

class CircleUserService extends BaseService {
  constructor() {
    super(CircleUserModel)
  }
  /**
   * 批量添加、删除圈子-用户
   * @param {String} circle 圈子id
   * @param {String} userRole 用户角色
   * @param {status} status 进圈状态
   * @param {users} users 用户id集合
   */
  async addBulk(circle, userRole, status, users) {
    assert(circle && userRole && status && users, 400, '请求参数错误')
    // 找出已经存在的数据
    const oldUsers = (await this.model.findByFilter({ circle, userRole })).map(v => v.user)
    // 比较之前的数据和新数据，找出添加的、删除的
    const res = findAddUpdateDelete(users, oldUsers)
    // 批量添加
    const arrAdd = res.arrAdd.map(v => ({circle, user: v, userRole, status}))
    await this.model.insertMany(arrAdd)
    // 批量删除
    await CircleUserModel.deleteMany({ circle, userRole, user: { $in: res.arrDel } })
    return '修改成功'
  }
  /**
   * 学生加入圈子
   * @param {String} user 用户id
   * @param {String} circle 圈子id
   */
  async joinCircle(user, circle) {
    assert(user && circle, 400, '请求参数错误')
    const circleUserInfo = await this.model.findOne({ user, circle })
    assert(!circleUserInfo, 422, '请勿重复申请')
    const userInfo = await AdminUserModel.findByID(user)
    const circleInfo = await CircleModel.findByID(circle)
    assert(userInfo && circleInfo, 422, '用户或圈子信息不存在')
    const data = {
      circle,
      user,
      userRole: 'student',
      status: circleInfo.enterWay === 0 ? 1 : 0
    }
    await this.model.createObj(data)
    return { message: circleInfo.enterWay === 0 ? '加入成功' : '申请成功，请等待老师审核' }
  }
  /**
   * 获取学生申请进入圈子列表（老师用）
   * @param {String} teaId 老师id
   * @param {String} stuSearch 学生姓名或学号
   * @param {Number} status 状态
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async getReviewList(teaId, stuSearch = '', status = { $in: [0, 1] }, page = 1, size = 30) {
    assert(teaId, 400, '请求参数错误')
    page = parseInt(page)
    size = parseInt(size)
    status = typeof (status) === 'string' ? parseInt(status) : status
    // 获取该老师管理的圈子id集合
    const circleIds = (await this.model.findByFilter({ user: teaId, userRole: 'teacher' })).map(v => mongoose.Types.ObjectId(v.circle))
    // 查找申请列表
    const result = await this.model.aggregate([
      {
        $addFields: { user: { $toObjectId: '$user' } }
      },
      {
        $addFields: { circle: { $toObjectId: '$circle' } }
      },
      {
        $lookup: { from: 'adminusers', localField: 'user', foreignField: '_id', as: 'userInfo' }
      },
      {
        $lookup: { from: 'circles', localField: 'circle', foreignField: '_id', as: 'circleInfo' }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $unwind: '$circleInfo'
      },
      {
        $project: {
          'userInfo.password': 0,
          'userInfo.openid': 0
        }
      },
      {
        $match: {
          $or: [
            { 'userInfo.username': { $regex: stuSearch } },
            { 'userInfo.number': { $regex: stuSearch } },
          ],
          userRole: 'student',
          status: status,
          circle: { $in: circleIds }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          list: { $push: '$$ROOT' }
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

module.exports = new CircleUserService()