import request from '@/utils/request'

const uri = '/admin/organizations'

// 获取列表
export function getList(data) {
  return request.get(`${uri}`, { params: data })
}

// 获取单个
export function getOrg({ id }) {
  return request.get(`${uri}/${id}`)
}

// 添加
export function addOrg(data) {
  return request.post(`${uri}`, data)
}

// 更新
export function updateOrg(data) {
  return request.put(`${uri}/${data._id}`, data)
}

// 删除
export function deleteOrg({ id }) {
  return request.delete(`${uri}/${id}`)
}

