import request from '@/utils/request'

const uri = '/admin/admin_users'

// 手机号登录
export function loginByPhone({ data }) {
  return request.post(`${uri}/login`, data)
}

// 根据token获取个人信息
export function getUserInfoByToken() {
  return request.get(`${uri}/token`)
}

// 添加用户
export function addUser({ data }) {
  return request.post(`${uri}`, data)
}

// 更新用户
export function updateUser({ id, data }) {
  return request.put(`${uri}/${id}`, data)
}

