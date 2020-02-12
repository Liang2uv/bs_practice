import request from '@/utils/request'

const uri = '/admin/main_plans'

// 获取某个老师管理的实习计划
export function getMainPlanListForTeacher({ data }) {
  return request.get(`${uri}/teacher`, { params: data })
}

