import request from '../utils/request'
// 获取我的好友列表
export function getFriendList() {
  return request('get', '/web/friends')
}
// 添加好友
export function addFriend({ data }) {
  return request('post', '/web/friends', data)
}