import request from '../utils/request'
// 获取近七日出勤率
export function getSevenDayClock({ data }) {
  return request('get', '/admin/day_summaries/seven_days', data)
}
// 获取某一日的出勤情况（包括班级出勤情况）
export function getOneDayClock({ data }) {
  return request('get', '/admin/day_summaries/one_day', data)
}
