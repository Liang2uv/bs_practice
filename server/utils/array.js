function findAddUpdateDelete(arrnew, arrold) {
  let arrAdd = []
  let arrEdit = []
  let arrDel = []
  arrnew.forEach(item => {
    const index = arrold.indexOf(item)
    if (index >= 0) {
      arrEdit.push(item)
      arrold.splice(index, 1)
    } else {
      arrAdd.push(item)
    }
  })
  arrDel = arrold
  return {
    arrAdd,
    arrEdit,
    arrDel
  }
}

module.exports = {
  findAddUpdateDelete
}