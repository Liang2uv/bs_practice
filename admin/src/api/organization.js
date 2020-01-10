import request from '@/utils/request'

const uri = '/admin/organizations'

// 获取树级列表
export function getOrgTreeList({ data }) {
  return request.get(`${uri}/tree`, { params: data })
}

// 添加
export function addOrg({ data }) {
  return request.post(`${uri}`, data)
}

// 删除
export function deleteOrg({ id }) {
  return request.delete(`${uri}/${id}`)
}

