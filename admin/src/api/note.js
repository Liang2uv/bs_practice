import request from '@/utils/request'

const uri = '/admin/notes'

// 获取实习记录列表（老师用）
export function getNoteList({ data }) {
  return request.get(`${uri}`, { params: data })
}

