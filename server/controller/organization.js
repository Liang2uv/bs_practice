const Organization = require('../model/Organization')
const getTree = require('../utils/getTree')
const assert = require('http-assert')
const mongoose = require('mongoose')

/**
 * 获取学校的组织机构的树级列表
 */

const getTreeList = async (pid, startLayer, endLayer) => {
  return await getTree([], startLayer, endLayer, pid, Organization)
}

/**
 * 获取列表（非树级）
 */
const getList = async (pid, layer, page, size, search, key) => {
  page = parseInt(page)
  size = parseInt(size)
  const query = { layer, [key]: { $regex: search } }
  if (layer > 0) {
    query.pid = mongoose.Types.ObjectId(pid)
  }
  const total = await Organization.find(query).countDocuments()
  const list = await Organization.find(query).skip(size * (page - 1)).limit(size).lean()
  return { total, list }
}

/**
 * 获取单个
 */

const getOrgan = async id => {
  return await Organization.findById(id)
}

/**
 * 添加
 */
const addOrgan = async data => {
  try {
    let path = ',0,'
    let layer = -1
    if (data.pid !== '0') {
      const pmodel = await Organization.findById(data.pid)
      assert(pmodel, 422, '找不到父级数据')
      path = pmodel.path
      layer = pmodel.layer
    } else {
      delete data.pid
    }
    data.path = `${path}`
    data.layer = layer + 1
    data.type = ['school', 'college', 'grade', 'major', 'class'][data.layer]
    const model = await Organization.create(data)
    model.path = `${model.path}${model._id},`
    return await Organization.findByIdAndUpdate(model._id, model, { new: true })
  } catch (ex) {
    assert(false, 422, `添加失败`)
  }
}

/**
 * 更新
 */
const updateOrgan = async (id, data) => {
  try {
    // 更新自身
    return await Organization.findByIdAndUpdate(id, data, { new: true })
    // TODO: 更新下级
  } catch (ex) {
    assert(false, 422, `更新失败`)
  }
}

/**
 * 删除
 */
const deleteOrgan = async id => {
  try {
    // 删除自身和它的下级
    await Organization.deleteMany({ path: { $regex: `,${id},` } })
  } catch (ex) {
    assert(false, 422, '删除失败')
  }
}

module.exports = {
  getTreeList,
  getList,
  getOrgan,
  addOrgan,
  updateOrgan,
  deleteOrgan
}