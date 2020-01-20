import { getDayRecordList } from '../../api/dayRecord'

const dayRecord = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetDayRecordList({ commit }, params) {
      return getDayRecordList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default dayRecord