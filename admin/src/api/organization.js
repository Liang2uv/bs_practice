import request from '@/utils/request'

// 获取树级列表
export function getTreeList({ school }) {
  return request.get(`/admin/organizations?type=tree&school=${school}`)
}

// 获取单个
export function getOrgan({ id }) {
  return request.get(`/admin/organizations/${id}`)
}

// 添加
export function addOrgan(data) {
  return request.post(`/admin/organizations`, data)
}

// 更新
export function updateOrgan(data) {
  return request.put(`/admin/organizations/${data._id}`, data)
}

// 删除
export function deleteOrgan({ id }) {
  return request.delete(`/admin/organizations/${id}`)
}

