import request from '@/utils/request'

const uri = '/public/crud'

/**
 * 
 * 通用CRUD接口封装
 */

// 获取列表
export function crudList(data) {
  return request.get(`${uri}/${data.resource}`, { params: data })
}

// 增加
export function crudAdd({ resource, data }) {
  return request.post(`${uri}/${resource}`, data)
}

// 删除
export function crudDelete({ resource, id }) {
  return request.delete(`${uri}/${resource}/${id}`)
}

// 更新
export function crudUpdate({ resource, data }) {
  return request.put(`${uri}/${resource}/${data._id}`, data)
}

// 获取单个详情
export function crudDetail({ resource, id }) {
  return request.get(`${uri}/${resource}/${id}`)
}