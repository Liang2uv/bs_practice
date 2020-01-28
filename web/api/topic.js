import request from '../utils/request'
// 添加帖子
export function addTopic({ data }) {
  return request('post', '/web/topics', data)
}