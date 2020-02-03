import request from '../utils/request'
// 获取签到记录列表（老师用）
export function getDayRecordList({ data }) {
  return request('get', '/admin/day_records', data)
}
