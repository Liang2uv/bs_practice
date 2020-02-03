import request from '../utils/request'
// 获取加入的圈子列表
export function getCircleJoinList({ data }) {
  return request('get', '/admin/circles', data)
}
// 创建圈子
export function addCircle({ data }) {
  return request('post', '/admin/circles', data)
}