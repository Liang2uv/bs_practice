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
        path: '/admin-user',
        name: 'admin-user',
        component: () => import('views/AdminUser.vue')
      },
      {
        path: '/teacher',
        name: 'teacher',
        component: () => import('views/Teacher.vue')
      },
      {
        path: '/student',
        name: 'student',
        component: () => import('views/Student.vue')
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
        path: '/main-plan',
        name: 'main-plan',
        component: () => import('views/MainPlan.vue')
      },
      {
        path: '/practice-files',
        name: 'practice-files',
        component: () => import('views/PracticeFiles.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('views/Profile.vue')
      },
      {
        path: '/update-pwd',
        name: 'update-pwd',
        component: () => import('views/UpdatePwd.vue')
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
