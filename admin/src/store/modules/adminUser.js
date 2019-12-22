import { getToken, setToken, clearToken } from '../../utils/auth'
import { loginByPhone, getUserList, getUserInfo, addUser, updateUser, deleteUser } from 'api/adminUser'
import router from '../../router'

const adminUser = {
  state: {
    token: getToken(),
    userInfo: {},
    filterRoutes: [],  // 过滤之后的路由
    redirect: '/404'  // 重定向的路由
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAR_LOGIN: (state) => {
      state.token = ''
      state.userInfo = {}
      state.filterRoutes = []
      state.redirect = '/404'
      clearToken()
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_FILTERROUTES: (state, routes) => {
      state.filterRoutes = routes
    },
    SET_REDIRECT: (state, redirect) => {
      state.redirect = redirect
    }
  },
  actions: {
    // 路由过滤
    FilterRoutes({ commit, state }) {
      return new Promise((resolve, reject) => {
        const routes = JSON.parse(JSON.stringify(router.options.routes))
        routes.map(item => {
          if (item.children) {
            item.children = item.children.filter(child => {
              return child.meta.priv.includes(state.userInfo.role)
            })
            // 修改重定向为第一个有效路由
            if (state.redirect === '/404' && item.children.length !== 0) {
              commit('SET_REDIRECT', item.children[0].path)
            }
          }
          return item
        })
        commit('SET_FILTERROUTES', routes)
        resolve()
      })
    },
    // 手机号登录
    LoginByPhone({ commit }, params) {
      const { phone = '', password = '' } = params
      return loginByPhone({ phone, password }).then(res => {
        commit('SET_TOKEN', res.token)
        setToken(res.token)
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 根据token获取用户信息
    GetUserInfoByToken({ commit }) {
      return getUserInfo({}).then(res => {
        commit('SET_USERINFO', res)
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 根据id获取用户信息
    GetUserInfoById({ commit }, data) {
      return getUserInfo(data).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 获取用户列表
    GetUserList({ commit }, { page = 1, size = 30, search = '', role, key = 'username' }) {
      return getUserList({ page, size, search, role, key }).then(res => {
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