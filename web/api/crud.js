import request from '../utils/request'
const uri = '/public/crud'
/**
 * 通用CRUD接口
 */

// 查询所有
export function crudList({ resource }) {
  return request('get', `${uri}/${resource}`)
}

// 带条件查询
export function crudListByFilter({ resource, data }) {
  return request('get', `${uri}/${resource}/filter`, data)
}

// 带条件关联查询
export function crudListByFilterAndRefs({ resource, data }) {
  return request('get', `${uri}/${resource}/filter/refs`, data)
}

// 带条件查询并分页
export function crudListByFilterAndPaging({ resource, data }) {
  return request('get', `${uri}/${resource}/filter/paging`, data)
}

// 带条件关联查询并分页
export function crudListByFilterAndRefsPaging({ resource, data }) {
  return request('get', `${uri}/${resource}/filter/refs/paging`, data)
}

// 增加
export function crudAdd({ resource, data }) {
  return request('post', `${uri}/${resource}`, data)
}

// 删除
export function crudDelete({ resource, id }) {
  return request.delete(`${uri}/${resource}/${id}`)
}

// 更新
export function crudUpdate({ resource, id, data }) {
  return request.put(`${uri}/${resource}/${id}`, data)
}

// 根据id查询
export function crudOneById({ resource, id }) {
  return request.get(`${uri}/${resource}/id/${id}`)
}

// 根据id关联查询
export function crudOneByIdAndRefs({ resource, id }) {
  return request.get(`${uri}/${resource}/id/refs/${id}`)
}