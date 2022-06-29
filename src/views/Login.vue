<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <p class="title">四月后台管理</p>
        <el-form-item prop="userName">
          <el-input type="text" v-model="user.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" v-model="user.userPwd" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin(userForm)" class="btn-login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import api from '../api/index'
import storage from '../utils/storage'
import UTILS from '../utils/utils'

const router = useRouter()
const store = useStore()

// 当前表单绑定的数据
const user = reactive({
  userName: '',
  userPwd: ''
})
const userForm = ref() // form实例
/**
 * 验证用户名
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
const checkUserName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  }
  callback()
}
/**
 * 验证密码
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
const checkUserPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  callback()
}
// 规则
const rules = reactive({
  userName: [{ validator: checkUserName, trigger: 'blur' }],
  userPwd: [{ validator: checkUserPwd, trigger: 'blur' }],
})
// 处理登录
const handleLogin = async (userForm) => {
  if (!userForm) return
  userForm.validate((valid) => {
    if (valid) {
      api.login(user).then(res => {
        store.commit('saveUserInfo', res) // 触发store里的方法，设置本地缓存
         loadAsyncRoutes()
        router.push({
          name: 'WelCome',
        })
      })
      return true
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const loadAsyncRoutes = async () => {
  let userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    const { menuList } = await api.getPermissionList()
    let routes = UTILS.generateRoute(menuList) // 调用这个方法生成路由
    routes.map(route => {
      // 需要把url变成变量，同时带上.vue文件
      let url = `./../views/${route.component}.vue`
      route.component = () => import(url)
      router.addRoute('home', route)
    })
  }
}
</script>
<style lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;

  .modal {
    width: 500px;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px 3px #c7c9cbdd;

    .title {
      font-size: 30px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 20px;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>