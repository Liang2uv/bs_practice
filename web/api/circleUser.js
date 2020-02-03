import request from '../utils/request'
// 学生申请加入圈子
export function joinCircle({ data }) {
  return request('post', '/web/circle_users', data)
}
// 获取某个圈子的进圈申请列表（老师用）
export function getCircleReviewList({ data }) {
  return request('get', '/web/circle_users', data)
}