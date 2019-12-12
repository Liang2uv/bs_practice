const Organization = require('../model/Organization')
const mongoose = require('mongoose')

/**
 * 获取列表
 */

const getList = async (name, pid) => {
  Organization.find({ name: { $regex: name }, pid: mongoose.Types.ObjectId(pid) })
}

module.exports = {
  getList
}