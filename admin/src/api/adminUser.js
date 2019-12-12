import request from '@/utils/request'

// 手机号登录
export function loginByPhone(data) {
  return request.post('/admin/adminUsers/login', data)
}

// 获取用户列表
export function getUserList({ page = 1, size = 30, search = '', role }) {
  return request.get(`/admin/adminUsers?page=${page}&size=${size}&search=${search}&role=${role}`)
}

// 根据token获取用户信息
export function getUserInfoByToken() {
  return request.get('/admin/adminUsers/1?self=1')
}

// 根据用户id获取用户信息
export function getUserInfoById({ id }) {
  return request.get(`/admin/adminUsers/${id}`)
}

// 添加用户
export function addUser(data) {
  return request.post(`/admin/adminUsers`, data)
}

// 更新用户
export function updateUser(data) {
  return request.put(`/admin/adminUsers/${data._id}`, data)
}

// 删除用户
export function deleteUser({ id }) {
  return request.delete(`/admin/adminUsers/${id}`)
}