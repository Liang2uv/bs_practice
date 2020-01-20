import request from '@/utils/request'

const uri = '/admin/day_offs'

// 获取学生的请假列表（老师用）
export function getDayOffList({ data }) {
  return request.get(`${uri}`, { params: data })
}

// 更新请假申请
export function updateDayOff({ id, data }) {
  return request.put(`${uri}/${id}`, data)
}
