import request from '@/utils/request'

const uri = '/admin/day_records'

// 获取学生的签到列表（老师用）
export function getDayRecordList({ data }) {
  return request.get(`${uri}`, { params: data })
}
