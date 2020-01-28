const BaseService = require('./baseService')
const CircleModel = require('../model/Circle')
const CircleUserModel = require('../model/CircleUser')
const assert = require('http-assert')
const mongoose = require('mongoose')

class CircleService extends BaseService {
  constructor() {
    super(CircleModel)
  }
  /**
   * 获取某个用户加入的圈子列表
   * @param {String} userId 用户id
   * @param {String} name 搜索圈子名称
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async getList(userId, name = '', page = 1, size = 30) {
    assert(userId, 400, '请求参数错误')
    // 获取用户加入的圈子id
    const ids = (await CircleUserModel.find({ user: userId, status: 1 }).lean()).map(v => mongoose.Types.ObjectId(v.circle))
    // 获取公共圈子id
    const pubModel = await this.model.findOne({ name: /^公共圈子$/ })
    if (pubModel) {
      ids.push(pubModel._id)
    }
    page = parseInt(page)
    size = parseInt(size)
    // 根据这些id获取圈子信息
    const total = (await this.model.findByFilter({ _id: { $in: ids }, name: { $regex: name } })).length
    const list = await this.model.findByFilterAndRefSkipLimit({ _id: { $in: ids }, name: { $regex: name } }, 'createrInfo', page, size)
    return { total, list }
  }
  /**
   * 创建圈子
   * @param {Object} data 添加的数据
   */
  async addCircle(data) {
    // 圈子名称不能相同
    const m = await this.model.findOne({ name: { $regex: `${data.name}$` } })
    assert(!m, 422, '圈子名称已存在')
    // 添加圈子基本信息
    const model = await this.model.createObj(data)
    // 创建者默认为圈子的初识管理员
    await CircleUserModel.create({ circle: model._id.toString(), user: model.creater, userRole: 'teacher', status: 1 })
    return model
  }
}

module.exports = new CircleService()