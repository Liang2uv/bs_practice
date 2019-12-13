const Organization = require('../model/Organization')
const getTree = require('../utils/getTree')
const assert = require('http-assert')

/**
 * 获取学校的组织机构的树级列表
 */

const getTreeList = async (school, startLayer, endLayer) => {
  assert(school, 400, '请求参数错误')
  return await getTree([], startLayer, endLayer, school, Organization)
}

/**
 * 获取单个
 */

const getOrgan =  async id => {
  const model = await Organization.findById(id)
  return model
}

/**
 * 添加
 */
const addOrgan = async data => {
  try {
    return await Organization.create(data)
  } catch (ex) {
    assert(false, 422, `请求出错`)
  }
}

/**
 * 更新
 */
const updateOrgan = async (id, data) => {
  // 更新自身
  const result = await Organization.findByIdAndUpdate(id, data)
  // TODO: 更新下级
  return result
}

/**
 * 删除
 */
const deleteOrgan = async id => {
  // 删除自身
  await Organization.findByIdAndRemove(id)
  // 删除和它的下级
  await Organization.deleteMany({path: {$regex: `,${id},`}})
  return true
}

module.exports = {
  getTreeList,
  getOrgan,
  addOrgan,
  updateOrgan,
  deleteOrgan
}