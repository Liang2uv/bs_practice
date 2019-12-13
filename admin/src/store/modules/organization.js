import { getTreeList, getOrgan, addOrgan, updateOrgan, deleteOrgan } from '../../api/organization'

const organization = {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取列表
    GetOrganList({}, params) {
      return getTreeList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 添加
    AddOrgan({}, params) {
      return addOrgan(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 修改
    UpdateOrgan({}, params) {
      return updateOrgan(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 删除
    DeleteOrgan({}, params) {
      return deleteOrgan(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 获取单个
    GetOrgan({}, params) {
      return getOrgan(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default organization