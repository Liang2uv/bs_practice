import { getReviewSum } from '../../api/other'

const other = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetReviewSum({ commit }) {
      return getReviewSum().then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default other