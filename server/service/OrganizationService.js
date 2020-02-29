const BaseService = require('./BaseService')
const OrganizationModel = require('../model/Organization')
const assert = require('http-assert')
const getTree = require('../utils/getTree')

class OrganizationService extends BaseService {
  constructor() {
    super(OrganizationModel)
  }
  /**
   * 获取树级组织结构列表
   * @param {Number} startLayer 搜索的起始层级
   * @param {Number} endLayer 搜索的结束层级
   * @param {String} pid 父级id
   */
  async getTreeList(startLayer, endLayer, pid) {
    assert(startLayer && endLayer && pid, 400, '请求参数错误')
    startLayer = parseInt(startLayer)
    endLayer = parseInt(endLayer)
    assert(startLayer >= 0 && endLayer >= 0 && endLayer <= 4 && startLayer <= endLayer, 400, '请求参数错误')
    return await getTree([], startLayer, endLayer, pid, this.model)
  }
  /**
   * 添加组织结构
   * @param {Object} model 添加的数据
   */
  async addOrgan(model) {
    assert(model.name && model.pid, 400, '请求参数错误')
    model.path = ',0,'
    model.layer = 0
    if (model.pid !== '0') { // 添加非学校
      const pmodel = await this.model.findByID(model.pid)
      assert(pmodel, 422, '找不到父级数据')
      model.path = `${pmodel.path}${pmodel._id},`
      model.layer = pmodel.layer + 1
    } else {  // 添加学校
      delete model.pid
    }
    model.type = ['school', 'college', 'grade', 'major', 'class'][model.layer]
    return await this.model.createObj(model)
  }
  /**
   * 删除组织结构
   * @param {String} id id
   */
  async deleteOrgan(id) {
    await this.model.removeObj(id)
    await this.model.removeObjByFilter({ path: { $regex: `,${id},` } })
    return { message: '删除成功' }
  }
}

module.exports = new OrganizationService()