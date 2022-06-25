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
      },
      {
        name: 'Menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
        },
        component: () => import('@/views/Menu.vue'),
      },
      {
        name: 'Role',
        path: '/system/role',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/views/Role.vue'),
      },
      {
        name: 'Dept',
        path: '/system/dept',
        meta: {
          title: '部门管理',
        },
        component: () => import('@/views/Dept.vue'),
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
