import request from '../utils/request'
// 获取学生的实习成绩（学生用）
export function getStudentScore({ data }) {
  return request('get', '/web/scores/student', data)
}
// 获取列表（老师用）
export function getScoreList({ data }) {
  return request('get', '/admin/scores', data)
}
// 统计一个实习计划的所有学生成绩
export function calcScoreForMainPlan({ data }) {
  return request('post', '/admin/scores/main_plan', data)
}
// 导出学生成绩数据
export function exportScore({ data }) {
  return request('get', '/admin/scores/export', data)
}