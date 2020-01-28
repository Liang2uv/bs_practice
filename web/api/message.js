import request from '../utils/request'
// 批量修改消息记录状态
export function updateMessageStatusBulk({ data }) {
  return request('post', '/web/messages/bulk', data)
}