import { getDayOffList, updateDayOff } from '../../api/dayOff'

const dayOff = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetDayOffList({ commit }, params) {
      return getDayOffList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    UpdateDayOff({ commit }, params) {
      return updateDayOff(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default dayOff