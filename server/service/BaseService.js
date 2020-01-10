const assert = require('http-assert')
const { strToObjForOrder, getMongoMatch } = require('../utils/utils')

class BaseService {
  constructor(model) {
    this.model = model
  }
  /**
   * 查询
   */
  async baseFindAll() {
    return await this.model.findAll()
  }
  /**
   * 查询并分页
   * @param {Number} page 页码
   * @param {Nuber} size 分页大小
   */
  async baseFindAllAndSkipLimit(page = 1, size = 30) {
    page = parseInt(page)
    size = parseInt(size)
    const total = (await this.baseFindAll()).length
    const list = await this.model.findAllAndSkipLimit(page, size)
    return { total, list }
  }
  /**
   * 查询并排序
   * @param {Object} order 排序方式
   */
  async baseFindAllAndOrder(order = '') {
    order = strToObjForOrder(order, '|', '_')
    return await this.model.findAllAndOrder(order)
  }
  /**
   * 查询并排序分页
   * @param {Object} order 排序方式
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindAllAndOrderSkipLimit(order = '', page = 1, size = 30) {
    order = strToObjForOrder(order, '|', '_')
    page = parseInt(page)
    size = parseInt(size)
    const total = (await this.baseFindAll()).length
    const list = await this.model.findAllAndOrderSkipLimit(order, page, size)
    return { total, list }
  }
  /**
   * 关联查询
   * @param {String} refs 关联字段
   */
  async baseFindAllAndRef(refs = '') {
    refs = refs.replace(/\|/g, ' ')
    return await this.model.findAllAndRef(refs)
  }
  /**
   * 关联查询并分页
   * @param {String} refs 关联字段
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindAllAndRefSkipLimit(refs = '', page = 1, size = 30) {
    refs = refs.replace(/\|/g, ' ')
    page = parseInt(page)
    size = parseInt(size)
    const total = (await this.baseFindAll()).length
    const list = await this.model.findAllAndRefSkipLimit(refs, page, size)
    return { total, list }
  }
  /**
   * 关联查询并排序
   * @param {String} refs 关联字段
   * @param {Object} order 排序方式
   */
  async baseFindAllAndRefOrder(refs = '', order = '') {
    refs = refs.replace(/\|/g, ' ')
    order = strToObjForOrder(order, '|', '_')
    return await this.model.findAllAndRefOrder(refs, order)
  }
  /**
   * 关联查询并排序分页
   * @param {String} refs 关联字段
   * @param {Object} order 排序方式
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindAllAndRefOrderSkipLimit(refs = '', order = '', page = 1, size = 30) {
    refs = refs.replace(/\|/g, ' ')
    order = strToObjForOrder(order, '|', '_')
    page = parseInt(page)
    size = parseInt(size)
    const total = (await this.baseFindAll()).length
    const list = await this.model.findAllAndRefOrderSkipLimit(refs, order, page, size)
    return { total, list }
  }
  /**
   * 根据id查询
   * @param {String} id id
   */
  async baseFindByID(id) {
    return await this.model.findByID(id)
  }
  /**
   * 根据id关联查询
   * @param {String} id id
   * @param {String} refs 关联字段
   */
  async baseFindByIDAndRef(id, refs = '') {
    refs = refs.replace(/\|/g, ' ')
    return await this.model.findByIDAndRef(id, refs)
  }
  /**
   * 带条件查询
   * @param {Object} filter 过滤条件
   */
  async baseFindByFilter(filter = {}) {
    filter = getMongoMatch(filter)
    return await this.model.findByFilter(filter)
  }
  /**
   * 带条件查询并分页
   * @param {Object} filter 过滤条件
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindByFilterAndSkipLimit(filter = {}, page = 1, size = 30) {
    const total = (await this.baseFindByFilter(filter)).length
    page = parseInt(page)
    size = parseInt(size)
    filter = getMongoMatch(filter)
    const list = await this.model.findByFilterAndSkipLimit(filter, page, size)
    return { total, list }
  }
  /**
   * 带条件查询并排序
   * @param {Object} filter 过滤条件
   * @param {String} order 排序方式
   */
  async baseFindByFilterAndOrder(filter = {}, order = '') {
    filter = getMongoMatch(filter)
    order = strToObjForOrder(order, '|', '_')
    return await this.model.findByFilterAndOrder(filter, order)
  }
  /**
   * 带条件查询并排序分页
   * @param {Object} filter 过滤条件
   * @param {Obejct} order 排序方式
   * @param {Numebr} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindByFilterAndOrderSkipLimit(filter = {}, order = '', page = 1, size = 30) {
    const total = (await this.baseFindByFilter(filter)).length
    filter = getMongoMatch(filter)
    order = strToObjForOrder(order, '|', '_')
    page = parseInt(page)
    size = parseInt(size)
    const list = await this.model.findByFilterAndOrderSkipLimit(filter, order, page, size)
    return { total, list }
  }
  /**
   * 带条件关联查询
   * @param {Object} filter 过滤条件
   * @param {String} refs 关联字段
   */
  async baseFindByFilterAndRef(filter = {}, refs = '') {
    filter = getMongoMatch(filter)
    refs = refs.replace(/\|/g, ' ')
    return await this.model.findByFilterAndRef(filter, refs)
  }
  /**
   * 带条件关联查询并分页
   * @param {Object} filter 过滤条件
   * @param {String} refs 关联字段
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindByFilterAndRefSkipLimit(filter = {}, refs = '', page = 1, size = 30) {
    const total = (await this.baseFindByFilter(filter)).length
    filter = getMongoMatch(filter)
    refs = refs.replace(/\|/g, ' ')
    page = parseInt(page)
    size = parseInt(size)
    const list = await this.model.findByFilterAndRefSkipLimit(filter, refs, page, size)
    return { total, list }
  }
  /**
   * 带条件关联查询并排序
   * @param {Object} filter 过滤条件
   * @param {String} refs 关联字段
   * @param {Object} order 排序方式
   */
  async baseFindByFilterAndRefOrder(filter = {}, refs = '', order = '') {
    filter = getMongoMatch(filter)
    refs = refs.replace(/\|/g, ' ')
    order = strToObjForOrder(order, '|', '_')
    return await this.model.findByFilterAndRefOrder(filter, refs, order)
  }
  /**
   * 带条件关联查询并排序分页
   * @param {Object} filter 过滤条件
   * @param {String} refs 关联字段
   * @param {Object} order 排序方式
   * @param {Number} page 页码
   * @param {Number} size 分页大小
   */
  async baseFindByFilterAndRefOrderSkipLimit(filter = {}, refs = '', order = '', page = 1, size = 30) {
    const total = (await this.baseFindByFilter(filter)).length
    filter = getMongoMatch(filter)
    refs = refs.replace(/\|/g, ' ')
    order = strToObjForOrder(order, '|', '_')
    page = parseInt(page)
    size = parseInt(size)
    const list = await this.model.findByFilterAndRefOrderSkipLimit(filter, refs, order, page, size)
    return { total, list }
  }
  /**
   * 根据id更新数据
   * @param {String} id id
   * @param {Object} update 更新的数据
   */
  async baseUpdateObj(id, update) {
    return await this.model.updateObj(id, update)
  }
  /**
   * 添加数据
   * @param {Object} obj 添加的数据
   */
  async baseCreateObj(obj) {
    return await this.model.createObj(obj)
  }
  /**
   * 根据id删除数据
   * @param {String} id id
   */
  async baseRemoveObj(id) {
    try {
      await this.model.removeObj(id)
      return { message: '删除成功' }
    } catch (error) {
      assert(false, 422, '删除失败')
    }
  }
  /**
   * 根据条件删除数据
   */
  async baseRemoveObjByFilter(filter) {
    try {
      await this.model.removeObjByFilter(filter)
      return { message: '删除成功' }
    } catch (error) {
      assert(false, 422, '删除失败')
    }
  }
}
module.exports = BaseService