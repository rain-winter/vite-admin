import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './../components/Home.vue'
import WelCome from '@/views/WelCome.vue'
import storage from '../utils/storage' // 本地缓存函数
import API from '../api' // api
import UTILS from '../utils/utils' // 工具函数

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
      // {
      //   name: 'User',
      //   path: '/system/user',
      //   meta: {
      //     title: '用户管理',
      //   },
      //   component: () => import('@/views/User.vue'),
      // },
      // {
      //   name: 'Menu',
      //   path: '/system/menu',
      //   meta: {
      //     title: '菜单管理',
      //   },
      //   component: () => import('@/views/Menu.vue'),
      // },
      // {
      //   name: 'Role',
      //   path: '/system/role',
      //   meta: {
      //     title: '角色管理',
      //   },
      //   component: () => import('@/views/Role.vue'),
      // },
      // {
      //   name: 'Dept',
      //   path: '/system/dept',
      //   meta: {
      //     title: '部门管理',
      //   },
      //   component: () => import('@/views/Dept.vue'),
      // },
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
    meta: {
      title: '404',
    },
    component: () => import('../views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const loadAsyncRoutes = async () => {
  let userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    const { menuList } = await API.getPermissionList()
    let routes = UTILS.generateRoute(menuList) // 调用这个方法生成路由
    routes.map(route => {
      // 需要把url变成变量，同时带上.vue文件
      let url = `./../views/${route.component}.vue`
      console.log(route)
      route.component = () => import(url)
      router.addRoute('home', route)
    })
  }
}
await loadAsyncRoutes()

// 判断是否可以访问
// /vvv 没有定义的路由就跳转到404页面
const checkPermission = path => {
  let hasPermission = router.getRoutes().filter(router => router.path == path).length
  if (hasPermission) {
    return true
  } else {
    return false
  }
}

// 导航守卫
// 这个可以执行很多次
// 但是整个router只执行一次
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})
export default router
