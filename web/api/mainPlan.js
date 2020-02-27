import request from '../utils/request'
// 获取某个老师管理的实习计划
export function getMainPlanListForTeacher({ data }) {
  return request('get', '/admin/main_plans/teacher', data)
}
