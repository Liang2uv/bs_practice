/**
 * 
 * @param {Array} clist 子节点
 * @param {Number} startLayer 起始层级
 * @param {Number} endLayer 结束层级
 * @param {String} pathId 路径ID
 * @param {Object} Model 模型
 */
const getTree = async (clist, startLayer, endLayer, pathId, Model) => {
  if (endLayer < startLayer) {
    return []
  }
  let plist = await Model.find({ layer: endLayer, path: {$regex: `^,${pathId},`} }).lean()
  plist = plist.map(p => {
    p.children = clist.filter(c => p._id.toString() === c.pid)
    if (p.children.length === 0) {
      delete p.children
    }
    return p
  })
  if (endLayer > startLayer) {
    return await getTree(plist, startLayer, endLayer - 1, pathId, Model)
  }
  else {
    return plist
  }
}

module.exports = getTree