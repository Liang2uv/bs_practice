import request from '../utils/request'
// 添加实习记录
export function addNote({ data }) {
  return request('post', '/web/notes', data)
}