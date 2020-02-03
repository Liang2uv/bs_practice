import request from '../utils/request'
// 获取请假申请列表（老师用）
export function getDayOffList({ data }) {
  return request('get', '/admin/day_offs', data)
}
// 更新请假申请
export function updateDayOff({ id, data }) {
  return request('put', `/admin/day_offs/${id}`, data)
}