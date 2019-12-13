import { getToken, setToken } from '../../utils/auth'
import { loginByPhone, getUserInfoByToken, getUserList, getUserInfoById, addUser, updateUser, deleteUser } from 'api/adminUser'

const adminUser = {
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAR_TOKEN: (state) => {
      state.token = ''
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 手机号登录
    LoginByPhone({ commit }, params) {
      const { phone = '', password = '' } = params
      return loginByPhone({ phone, password }).then(res => {
        commit('SET_TOKEN', res.token)
        commit('SET_USERINFO', res.userInfo)
        setToken(res.token)
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 根据token获取用户信息
    GetUserInfoByToken({ commit }) {
      return getUserInfoByToken().then(res => {
        commit('SET_USERINFO', res)
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 根据id获取用户信息
    GetUserInfoById({ commit }, data) {
      return getUserInfoById(data).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 获取用户列表
    GetUserList({ commit }, data) {
      return getUserList(data).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 添加用户
    AddUser({ commit }, data) {
      return addUser(data).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 更新用户
    UpdateUser({ commit }, data) {
      return updateUser(data).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 删除用户
    DeleteUser({ commit }, data) {
      return deleteUser(data).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default adminUser