import request from '@/utils/request'

const uri = '/admin/admin_users'

// 手机号登录
export function loginByPhone(data) {
  return request.post(`${uri}/login`, data)
}

// 获取用户列表
export function getUserList(data) {
  return request.get(`${uri}`, { params: data})
}

// 根据用户id获取用户信息
export function getUserInfo({ id }) {
  return request.get(`${uri}/${id}`)
}

// 添加用户
export function addUser(data) {
  return request.post(`${uri}`, data)
}

// 更新用户
export function updateUser(data) {
  return request.put(`${uri}/${data._id}`, data)
}

// 删除用户
export function deleteUser({ id }) {
  return request.delete(`${uri}/${id}`)
}