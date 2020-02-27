import request from '../utils/request'
// 获取学生的实习成绩（学生用）
export function getStudentScore({ data }) {
  return request('get', '/web/scores/student', data)
}
