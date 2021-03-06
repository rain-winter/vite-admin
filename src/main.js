import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
// console.log(process.env)  在vue中可以获取
// 在 vite 里
// console.log(import.meta.env)
// 引入 elementui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// if you're using CDN, please remove this line.
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import 'default-passive-events'

import request from './utils/request' // 引入request
import api from './api'
import storage from './utils/storage'

const app = createApp(App)
app.provide('$api', api) // vue3推荐的方式 全局挂载api

// 引用ElementuiPlus所有的icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 自定义全局指令
app.directive('has', {
  // 渲染之前
  // dom对象  bingding对象
  beforeMount: (el, binding) => {
    // 获取按钮权限
    let userAction = storage.getItem('actionList') // 一个数组
    let value = binding.value
    // 判断列表中是否有对应的按钮权限标识
    let hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style = 'display:none'
      // 宏任务 ，挂载后执行
      setTimeout(_ => {
        // 自定义指令实现按钮的显示
        el.parentNode.removeChild(el)
      }, 0)
    }
  },
})

// app.config.globalProperties.$request = request // 全局挂在request函数
app.config.globalProperties.$api = api // 全局挂载api
// app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus).use(store).mount('#app')
