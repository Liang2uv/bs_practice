import { getOneDayClock, getSevenDayClock } from '../../api/daySummary'

const daySummary = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetOneDayClock({ commit }, params) {
      return getOneDayClock(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    GetSevenDayClock({ commit }, params) {
      return getSevenDayClock(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default daySummary