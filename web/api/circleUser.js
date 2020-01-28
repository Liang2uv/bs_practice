import request from '../utils/request'
// 学生申请加入圈子
export function joinCircle({ data }) {
  return request('post', '/web/circle_users', data)
}