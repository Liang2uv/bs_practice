import request from '@/utils/request'

/**
 * 
 * 通用CRUD接口封装
 */

// 获取列表
export function crudList({ resource }) {
  return request.get(`/crud/${resource}`)
}

// 增加
export function crudAdd({ resource, data }) {
  return request.post(`/crud/${resource}`, data)
}

// 删除
export function crudDelete({ resource, id }) {
  return request.delete(`/crud/${resource}/${id}`)
}

// 更新
export function crudUpdate({ resource, data }) {
  return request.put(`/crud/${resource}/${data._id}`, data)
}

// 获取单个详情
export function crudDetail({ resource, id }) {
  return request.get(`/crud/${resource}/${id}`)
}