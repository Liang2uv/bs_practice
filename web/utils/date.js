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