import request from '../utils/request'
// 微信小程序登录
export function login({ data }) {
  return request('post', '/web/admin_users/login', data)
}
// 账号绑定
export function bind({ data }) {
  return request('post', '/web/admin_users/bind', data)
}
// 根据token获取用户信息
export function getUserInfoByToken() {
  return request('get', '/admin/admin_users/token')
}
// 注册用户
export function addUser({ data }) {
  return request('post', '/web/admin_users/register', data)
}