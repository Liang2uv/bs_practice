/***************字符串处理相关**************/

/**
 * 将字符串处理转为对象
 * @param {String} str 要处理的字符串
 * @param {String} sp1 键值对间的分隔符
 * @param {String} sp2 键与值之间的分隔符
 * @param {Object} options 选项
 */
function strToObj(str, sp1, sp2, options) {
  let obj = {}
  str.split(sp1).forEach(kv => {
    const arr = kv.split(sp2)
    if (arr[1]) {
      if (options.number) {
        arr[1] = Number(arr[2])
        if (arr[1] !== 'NaN') {
          obj[arr[0]] = arr[1]
        }
      } else {
        obj[arr[0]] = arr[1]
      }
    }
  })
  return obj
}

/**
 * 将字符串id_asc::likes_desc转为对象{id:1,like:-1}
 * @param {String} str 要处理的字符串
 * @param {String} sp1 键值对间的分隔符
 * @param {String} sp2 键与值之间的分隔符
 */
function strToObjForOrder(str, sp1, sp2) {
  let obj = {}
  str.split(sp1).forEach(kv => {
    const arr = kv.split(sp2)
    if (arr[1]) {
      arr[1] = arr[1] === 'asc' ? 1 : -1
      obj[arr[0]] = arr[1]
    }
  })
  return obj
}

/**
 * 将{name:'^aa'}转化为{name:{$regex:'^aa'}}
 * @param {Object} obj 需要转换的对象
 */
function getMongoMatch(obj) {
  const newObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = { $regex: obj[key] }
    }
  }
  return newObj
}

module.exports = { strToObj, strToObjForOrder, getMongoMatch }