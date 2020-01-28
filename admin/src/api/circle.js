import request from '@/utils/request'

const uri = '/admin/circles'

// 创建圈子
export function addCircle({ data }) {
  return request.post(`${uri}`, data)
}

// 获取圈子列表
export function getCircleList({ data }) {
  return request.get(`${uri}`, { params: data })
}

