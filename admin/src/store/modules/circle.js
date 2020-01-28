import { addCircle, getCircleList } from '../../api/circle'

const note = {
  state: {
  },
  mutations: {
  },
  actions: {
    AddCircle({ commit }, params) {
      return addCircle(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    GetCircleList({ commit }, params) {
      return getCircleList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default note