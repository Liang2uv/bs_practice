import request from '../utils/request'
// 获取某个帖子的评论列表
export function getCommentList({ data }) {
  return request('get', '/web/comments', data)
}
// 添加评论
export function addComment({ data }) {
  return request('post', '/web/comments', data)
}