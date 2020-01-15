const fs = require('fs')
const path = require('path')

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
// ------------------ 日期处理相关 ------------------------
 function padStart(num) {
  return num < 10 ? "0" + num : num
}
function formatDate(date) {
  date = date instanceof Date ? date : new Date(date)
  return `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`
}
/**
 * 获取两个日期之间的天数
 * @param {Date} startDate 开始日期
 * @param {Date} endDate 结束日期
 * @param {Boolean} includes 是否包括这两个日期
 */
function getDateSpanDays(startDate, endDate, includes = true) {
  startDate = startDate instanceof Date ? startDate : new Date(startDate)
  endDate = endDate instanceof Date ? endDate : new Date(endDate)
  startDate.setHours(0)
  endDate.setHours(23)
  const days = Math.floor((Math.abs(endDate.getTime() - startDate.getTime())) / (24 * 3600 * 1000))
  return days
}

/**
 * 获取所有的工作日
 */
function getWorkDays(startDate, endDate) {
  let holidays = fs.readFileSync(path.resolve(__dirname + '/../assets/holidays.json'))
  holidays = JSON.parse(holidays)
  const days = []
  const end = new Date(endDate)
  let day = new Date(startDate)
  day.setHours(0)
  day.setMinutes(0)
  day.setSeconds(0)
  while(day <= end) {
    if (!holidays[formatDate(day)]) {
      days.push(day)
    }
    day = new Date(day.getTime() + 24 * 3600 * 1000)
  }
  return days
}

module.exports = { strToObj, strToObjForOrder, getMongoMatch, getDateSpanDays, getWorkDays }