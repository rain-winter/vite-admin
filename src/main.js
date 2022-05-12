import {
  createApp
} from 'vue'
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


import request from './utils/request' // 引入request
import api from './api'
import storage from './utils/storage'

const app = createApp(App)
app.provide('$api', api)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.config.globalProperties.$request = request // 全局挂在request函数
// app.config.globalProperties.$api = api // 全局挂在request函数
// app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus).use(store).mount('#app')