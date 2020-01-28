import request from '@/utils/request'

const uri = '/admin/circle_users'

// 批量添加、删除圈子管理员
export function addCricleUserBulk({ data }) {
  return request.put(`${uri}/bulk`, data)
}

// 获取学生申请进入圈子列表
export function getCricleUserList({ data }) {
  return request.get(`${uri}`, { params: data })
}

