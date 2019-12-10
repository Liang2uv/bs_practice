import { crudList, crudDetail, crudUpdate, crudAdd, crudDelete } from '../../api/crud'

const crud = {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取列表
    CrudList({}, params) {
      return crudList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 添加
    CrudAdd({}, params) {
      return crudAdd(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 修改
    CrudUpdate({}, params) {
      return crudUpdate(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 删除
    CrudDelete({}, params) {
      return crudDelete(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 获取单个
    CrudDetail({}, params) {
      return crudDetail(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default crud