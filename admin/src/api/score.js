import request from '@/utils/request'

const uri = '/admin/scores'

// 获取实习成绩列表（老师用）
export function getScoreList({ data }) {
  return request.get(`${uri}`, { params: data })
}
// 统计一个实习计划的所有学生成绩
export function calcScoreForMainPlan({ data }) {
  return request.post(`${uri}/main_plan`, data)
}
// 统计一个学生在某个实习计划的成绩
export function calcScoreForStudent({ data }) {
  return request.post(`${uri}/student`, data)
}
// 导出学生成绩
export function exportScore({ data }) {
  return request.get(`${uri}/export`, { params: data })
}
