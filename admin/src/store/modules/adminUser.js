import { getToken, setToken } from '../../utils/auth'
import { loginByPhone } from 'api/adminUser'

const adminUser = {
  state: {
    token: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAR_TOKEN: (state) => {
      state.token = ''
    }
  },
  actions: {
    // 手机号登录
    LoginByPhone({ commit }, params) {
      const { phone = '', password = '' } = params
      return loginByPhone({ phone, password }).then(res => {
        commit('SET_TOKEN', res)
        setToken(res)
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default adminUser