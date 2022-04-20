import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'

// console.log(process.env)  在vue中可以获取
// 在 vite 里
console.log(import.meta.env)
// 引入 elementui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import request from './utils/request' // 引入request
import api from './api'

const app = createApp(App)

// app.config.globalProperties.$request = request // 全局挂在request函数
app.config.globalProperties.$api = api // 全局挂在request函数

app.use(router).use(ElementPlus, { size: 'small' }).use(store).mount('#app')
