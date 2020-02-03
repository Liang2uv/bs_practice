import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from 'views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    meta: { public: true },
    component: () => import('views/Login.vue')
  },
  {
    path: '/404',
    hidden: true,
    meta: { public: true },
    component: () => import('views/errorPage/404.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页', icon: 'el-icon-s-home', priv: ['superadmin', 'admin','teacher', 'student'] },
        component: () => import('views/Home.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { title: '实习配置', icon: 'el-icon-eleme' },
    children: [
      {
        path: '/main-plan',
        name: 'main-plan',
        meta: { title: '实习计划', icon: 'icon', priv: ['admin'] },
        component: () => import('views/MainPlan.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { title: '基础配置', icon: 'el-icon-setting' },
    children: [
      {
        path: '/admin-user',
        name: 'admin-user',
        meta: { title: '管理员', icon: 'icon', priv: ['superadmin'] },
        component: () => import('views/AdminUser.vue')
      },
      {
        path: '/school',
        name: 'school',
        meta: { title: '学校管理', icon: 'icon', priv: ['superadmin'] },
        component: () => import('views/School.vue')
      },
      {
        path: '/organization',
        name: 'organization',
        meta: { title: '组织架构', icon: 'icon', priv: ['admin']},
        component: () => import('views/Organization.vue')
      },
      {
        path: '/teacher',
        name: 'teacher',
        meta: { title: '教师管理', icon: 'icon', priv: ['admin'] },
        component: () => import('views/Teacher.vue')
      },
      {
        path: '/student',
        name: 'student',
        meta: { title: '学生管理', icon: 'icon', priv: ['admin'] },
        component: () => import('views/Student.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { title: '实习申请', icon: 'el-icon-setting' },
    children: [
      {
        path: '/task',
        name: 'task',
        meta: { title: '实习任务', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/Task.vue')
      },
      {
        path: '/day-off',
        name: 'day-off',
        meta: { title: '请假审核', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/DayOff.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { title: '实习过程', icon: 'el-icon-setting' },
    children: [
      {
        path: '/day-record',
        name: 'day-record',
        meta: { title: '签到记录', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/DayRecord.vue')
      },
      {
        path: '/note-day',
        name: 'note-day',
        meta: { title: '实习日记', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/NoteDay.vue')
      },
      {
        path: '/note-week',
        name: 'note-week',
        meta: { title: '实习周记', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/NoteWeek.vue')
      },
      {
        path: '/note-month',
        name: 'note-month',
        meta: { title: '实习月记', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/NoteMonth.vue')
      },
      {
        path: '/note-summary',
        name: 'note-summary',
        meta: { title: '实习总结', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/NoteSummary.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { title: '圈子管理', icon: 'el-icon-setting' },
    children: [
      {
        path: '/circles',
        name: 'circles',
        meta: { title: '我的圈子', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/Circle.vue')
      },
      {
        path: '/circle_review',
        name: 'circle_review',
        meta: { title: '进圈审核', icon: 'icon', priv: ['teacher'] },
        component: () => import('views/CircleReview.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { title: '个人中心', icon: 'el-icon-user' },
    children: [
      {
        path: '/profile',
        name: 'profile',
        meta: { title: '修改信息', icon: 'icon', priv: ['superadmin', 'admin', 'teacher', 'student'] },
        component: () => import('views/Profile.vue')
      },
      {
        path: '/update-pwd',
        name: 'update-pwd',
        meta: { title: '修改密码', icon: 'icon', priv: ['superadmin', 'admin', 'teacher', 'student'] },
        component: () => import('views/UpdatePwd.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
