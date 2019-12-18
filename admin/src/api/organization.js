import request from '@/utils/request'

const uri = '/admin/organizations'

// 获取树级列表
export function getTreeList(data) {
  return request.get(`${uri}`, {params: data})
}

// 获取单个
export function getOrgan({ id }) {
  return request.get(`${uri}/${id}`)
}

// 添加
export function addOrgan(data) {
  return request.post(`${uri}`, data)
}

// 更新
export function updateOrgan(data) {
  return request.put(`${uri}/${data._id}`, data)
}

// 删除
export function deleteOrgan({ id }) {
  return request.delete(`${uri}/${id}`)
}

