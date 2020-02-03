import request from '../utils/request'
// 添加实习记录
export function addNote({ data }) {
  return request('post', '/web/notes', data)
}
// 获取学生的实习记录列表（老师用）
export function getNoteList({ data }) {
  return request('get', '/admin/notes', data)
}