import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './../components/Home.vue'
import WelCome from '@/views/WelCome.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'WelCome',
        path: '/welcome',
        meta: {
          title: 'Welcome to April',
        },
        component: WelCome,
      },
      {
        name: 'User',
        path: '/system/user',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/User.vue'),
      }
    ],

  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
    },
    component: () => import('../views/Login.vue'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../views/404.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
