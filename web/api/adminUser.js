import request from '../utils/request'
export function login(data) {
  return request('post', '/web/admin_users/login' ,data)
}