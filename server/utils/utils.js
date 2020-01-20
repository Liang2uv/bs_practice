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
      if (key === 'status') {
        newObj[key] = Number(obj[key])
      } else {
        newObj[key] = { $regex: obj[key] }
      }
    }
  }
  return newObj
}
// ------------------ 日期处理相关 ------------------------
 function padStart(num) {
  return num < 10 ? "0" + num : num
}
function formatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
  date = date instanceof Date ? date : new Date(date)
  const year = date.getFullYear()
  const month = padStart(date.getMonth() + 1)
  const day = padStart(date.getDate())
  const hour = padStart(date.getHours())
  const minute = padStart(date.getMinutes())
  const second = padStart(date.getSeconds())
  return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', second)
}
/**
 * 比较两个日期之间的大小关系
 * flag = true的时候只比较年月日
 * 返回0-date1<date2，1-date1=date2, 2-date1>date2
 */
function dateCompare(date1, date2, flag = false) {
  date1 = date1 instanceof Date ? date1 : new Date(date1)
  date2 = date2 instanceof Date ? date2 : new Date(date2)
  if (flag) {
    const d1 = parseInt(formatDate(date1, 'yyyyMMdd'))
    const d2 = parseInt(formatDate(date2, 'yyyyMMdd'))
    const res = (d1 < d2 ? 0 : (d1 == d2 ? 1 : 2) )
    return res
  } else {
    return (date1 < date2 ? 0 : (date1 == date2 ? 1 : 2) )
  }
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
  let end = endDate instanceof Date ? endDate : new Date(endDate)
  let day = startDate instanceof Date ? startDate : new Date(startDate)
  while(dateCompare(day, end, true) < 2) {
    if (!holidays[formatDate(day, 'yyyy-MM-dd')]) {
      days.push(day)
    }
    day = new Date(day.getTime() + 24 * 3600 * 1000)
  }
  return days
}

/**
 * 判断某个时间段是否与其他时间段列表有重叠
 */
function dateCrossList(date, dateArr) {
  let ret = false
  for (let i = 0; i < dateArr.length; i++) {
    if (dateCompare(date[1], dateArr[i][0], true) === 0 || dateCompare(date[0], dateArr[i][1], true) === 2) {  // 不重叠
      continue
    }
    ret = true
    break
  }
  return ret
}

/**
 * 将时间设为00:00:00或23:59:59
 */
function dataSetTime(date, type = '00') {
  if (type === '00') {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
  } else if (type === '23') {
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setMilliseconds(999)
  }
  return date
}

module.exports = { 
  strToObj, 
  strToObjForOrder, 
  getMongoMatch, 
  getDateSpanDays, 
  getWorkDays,
  dateCrossList, 
  dateCompare,
  dataSetTime
}