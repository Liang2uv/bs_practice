import { getList, getOrg, addOrg, updateOrg, deleteOrg } from '../../api/organization'

const organization = {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取列表
    GetOrgList({}, params) {
      return getList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 添加
    AddOrg({}, params) {
      return addOrg(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 修改
    UpdateOrg({}, params) {
      return updateOrg(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 删除
    DeleteOrg({}, params) {
      return deleteOrg(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 获取单个
    GetOrg({}, params) {
      return getOrg(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default organization