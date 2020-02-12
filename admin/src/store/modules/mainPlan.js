import { getMainPlanListForTeacher } from '../../api/mainPlan'

const mainPlan = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetMainPlanListForTeacher({ commit }, params) {
      return getMainPlanListForTeacher(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default mainPlan