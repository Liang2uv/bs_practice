import request from '../utils/request'
// 邀请评价
export function inviteRate({ data }) {
  return request('post', '/web/rates', data)
}
