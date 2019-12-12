import request from '@/utils/request'

/**
 * 
 * 通用CRUD接口封装
 */

// 获取列表
export function crudList({ resource, page = 1, size = 30, search = '', key = 'name' }) {
  return request.get(`/public/crud/${resource}?page=${page}&size=${size}&search=${search}&key=${key}`)
}

// 增加
export function crudAdd({ resource, data }) {
  return request.post(`/public/crud/${resource}`, data)
}

// 删除
export function crudDelete({ resource, id }) {
  return request.delete(`/public/crud/${resource}/${id}`)
}

// 更新
export function crudUpdate({ resource, data }) {
  return request.put(`/public/crud/${resource}/${data._id}`, data)
}

// 获取单个详情
export function crudDetail({ resource, id }) {
  return request.get(`/public/crud/${resource}/${id}`)
}