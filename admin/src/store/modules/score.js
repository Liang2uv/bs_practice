import { getScoreList, calcScoreForMainPlan, calcScoreForStudent } from '../../api/score'

const score = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetScoreList({ commit }, params) {
      return getScoreList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    CalcScoreForMainPlan({ commit }, params) {
      return calcScoreForMainPlan(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    CalcScoreForStudent({ commit }, params) {
      return calcScoreForStudent(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default score