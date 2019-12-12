import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from 'views/Layout.vue'
import { getToken } from 'utils/auth.js'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/login',
    name: 'login',
    meta: { public: true },
    component: () => import('views/Login.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('views/Home.vue')
      },
      {
        path: '/adminUser',
        name: 'adminUser',
        component: () => import('views/AdminUser.vue')
      },
      {
        path: '/school',
        name: 'school',
        component: () => import('views/School.vue')
      },
      {
        path: '/organization',
        name: 'organization',
        component: () => import('views/Organization.vue')
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('views/Test.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

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
      return next()
    }).catch(() => {
      return next('/login')
    })
  } else {
    next()
  }
})


export default router
