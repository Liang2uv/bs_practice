import router from '../router'
import store from '../store'
import Vue from 'vue'
import { getToken } from './auth.js'

// 路由判断
router.beforeEach((to, from, next) => {
  if (!to.meta.public && !getToken()) { // 没有token
    Vue.prototype.$message({
      type: 'error',
      message: '无权访问，请先登录'
    })
    return next('/login')
  } else if (getToken() && !store.getters.userInfo._id) { // 没有用户信息
    store.dispatch('GetUserInfoByToken').then(() => {
      // 生成动态路由
      store.dispatch('FilterRoutes')
    }).then(() => {
      // 自定义重定向
      if (to.path === '/') return next(store.getters.redirect)
      if (!isExistPath(to.path)) return next('/404')
      return next()
    }).catch(() => {
      return next('/login')
    })
  } else {
    if (store.getters.filterRoutes.length === 0) {
      store.dispatch('FilterRoutes').then(() => {
        // 自定义重定向
        if (to.path === '/') return next(store.getters.redirect)
        if (!isExistPath(to.path)) return next('/404')
        return next()
      }).catch(() => {
        return next('/login')
      })
    } else {
      // 自定义重定向
      if (to.path === '/') return next(store.getters.redirect)
      if (!isExistPath(to.path)) return next('/404')
      return next()
    }
  }
})

// 查找path是否存在
function isExistPath(path) {
  return store.getters.filterRoutes.some(item => {
    if (item.path === path) {
      return true
    } else {
      if (item.children) {
        return item.children.some(c => c.path === path)
      } else {
        return false
      }
    }
  })
}
