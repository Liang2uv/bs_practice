import request from '../utils/request'
// 获取实习有效天数
export function getWorkDays({ data }) {
  return request('get', '/web/tasks/work_days', data)
}
// 添加实习任务
export function addTask({ data }) {
  return request('post', '/web/tasks', data)
}

// 获取当前实习任务信息
export function getCurrentTask() {
  return request('get', '/web/tasks/current')
}
