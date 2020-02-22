import request from '@/utils/request'

const uri = '/admin/day_summaries'

// 获取近七日出勤率
export function getSevenDayClock({ data }) {
  return request.get(`${uri}/seven_days`, { params: data })
}
// 获取某一日的出勤情况（包括班级出勤情况）
export function getOneDayClock({ data }) {
  return request.get(`${uri}/one_day`, { params: data })
}
