import moment from 'moment'
export function getDateDiff(start, end, type) {
  const mstart = moment(start)
  const mend = moment(end)
  return mend.diff(mstart, type)
}

/**
 * 比较两个时间段的状态：
 * 0-date1<date1 
 * 1-date1和date2有重叠
 * 2-date1>date2
 * @param {Array} date1 
 * @param {Array} date2 
 */
export function getDateCross(date1, date2) {
  date1[0] = date1[0] instanceof Date ? date1[0] : new Date(date1[0])
  date2[0] = date2[0] instanceof Date ? date2[0] : new Date(date2[0])
  date1[1] = date1[1] instanceof Date ? date1[1] : new Date(date1[1])
  date2[1] = date2[1] instanceof Date ? date2[1] : new Date(date2[1])
  if (date1[1] <= date2[0]) {
    return 0
  } else if (date1[0] >= date2[1]) {
    return 2
  } else {
    return 1
  }
}
/**
 * 判断某个时间和一个时间段直接的关系
 * 0-date<dateArr 1-date在dateArr中 2-date>dateArr
 * @param {Date} date 
 * @param {Array} dateArr 
 */
export function getDateIn(date, dateArr) {
  date = date instanceof Date ? date : new Date(date)
  dateArr[0] = dateArr[0] instanceof Date ? dateArr[0] : new Date(dateArr[0])
  dateArr[1] = dateArr[1] instanceof Date ? dateArr[1] : new Date(dateArr[1])
  if (date <= dateArr[0]) {
    return 0
  } else if (date >= dateArr[1]) {
    return 2
  } else {
    return 1
  }
}

