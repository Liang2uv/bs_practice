import { getOrgTreeList, addOrg, deleteOrg } from '../../api/organization'

const organization = {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取树级列表
    GetOrgTreeList({}, params) {
      return getOrgTreeList(params).then(res => {
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
    // 删除
    DeleteOrg({}, params) {
      return deleteOrg(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default organization