import request from '@/utils/request'

export function loginByPhone(data) {
  return request.post('/login', data)
}