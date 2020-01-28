import { addCricleUserBulk, getCricleUserList } from '../../api/circleUser'

const circleUser = {
  state: {
  },
  mutations: {
  },
  actions: {
    AddCricleUserBulk({ commit }, params) {
      return addCricleUserBulk(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    GetCricleUserList({ commit }, params) {
      return getCricleUserList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default circleUser