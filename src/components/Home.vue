<template>
  <div class="basic-layout">
    <div class="nav-side" :class="isCollapse ? 'fold-menu' : 'unfold-menu'">
      <!-- 系统logo -->
      <div class="logo">
        <img src="../assets/logo.png" />
        <span>Manager</span>
      </div>

      <!-- 导航按钮 -->
      <div>
        <el-menu
          style="border: none"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#001529"
          text-color="#ffffff"
          router
        >
          <TreeMenu :userMenu="userMenu" />
        </el-menu>
      </div>
    </div>
    <div :class="['content-right', isCollapse ? 'fold-content' : 'unfold-content']">
      <div class="nav-top">
        <div class="nav-left">
          <el-icon style="cursor: pointer" @click="expandOrCollapse">
            <fold />
          </el-icon>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>

        <div class="user-info">
          <el-badge :is-dot="noticeCount" class="notice">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span>{{ userInfo.userName }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>邮箱:{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <!-- <div class="main-page"> -->
        <router-view />
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { Fold, Bell } from '@element-plus/icons-vue'
import { reactive, ref, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'

const router = useRouter()
const store = useStore()
const $api = inject('$api')

let isCollapse = ref(false)
let userInfo = reactive({})
let noticeCount = ref(0)
let userMenu = reactive([])

userInfo = store.state.userInfo || '请登录'
noticeCount = store.state.noticeCount

// 退出系统
const handleLogout = key => {
  if (key === 'logout') {
    // 清楚manager下的所有缓存
    store.commit('clearSpace')
    router.push({ path: '/login' })
  }
}
// 获取 通知
const getNoticeCount = async () => {
  const count = await $api.noticeCount()
  noticeCount = count
}

// 获取menu列表
const getMenuList = async () => {
  let { menuList, actionList } = await $api.getPermissionList()
  userMenu.push(...menuList)
  store.commit('saveUserMenu', menuList)
  store.commit('saveUserAction', actionList)
  // $api.getMenuList().then(res => {
  //   userMenu.push(...res)
  // })
}

// 展开和收缩
const expandOrCollapse = () => {
  isCollapse.value = !isCollapse.value
}

getNoticeCount()
getMenuList()
</script>
<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.basic-layout {
  position: relative;

  .fold-menu {
    width: 64px !important;
  }

  .unfold-menu {
    width: 200px !important;
  }

  .nav-side {
    position: absolute;
    height: 100vh;
    background-color: #001529;
    overflow-y: auto;
    transition: 0.5s;

    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #fff;

      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
  }

  .fold-content {
    margin-left: 64px !important;
  }

  .unfold-content {
    margin-left: 200px !important;
  }

  .content-right {
    margin-left: 200px;
    transition: 0.5s;

    .nav-top {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ddd;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .bread {
          margin-left: 10px;
        }
      }

      .user-info {
        display: flex;
        justify-content: center;
        align-items: center;

        .notice {
          width: 20px;
          height: 20px;
          line-height: 26px;
          margin-right: 10px;
        }
      }
    }

    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      overflow-y: auto;
    }

    .main-page {
      background-color: #fff;
      height: 100%;
    }
  }
}
</style>
