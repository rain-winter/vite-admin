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
        <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <icon-menu />
              </el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="1-1">item one</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <icon-menu />
              </el-icon>
              <span>审批管理</span>
            </template>
            <el-menu-item index="1-2">休假申请</el-menu-item>
            <el-menu-item index="1-2">带我审批</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
    <div :class="['content-right', isCollapse ? 'fold-content' : 'unfold-content']">
      <div class="nav-top">
        <div class="nav-left">
          <el-icon style="cursor: pointer" @click="expandOrCollapse">
            <fold />
          </el-icon>
          <div class="bread">面包屑</div>
        </div>

        <div class="user-info">
          <el-badge :is-dot="true" class="notice">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span>{{ userInfo.userName }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>邮箱:{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">推出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Fold,
  Bell,
} from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const store = useStore()
let isCollapse = ref(true)

let userInfo = reactive({})
userInfo = store.state.userInfo || '请登录'

// 退出系统
const handleLogout = (key) => {
  if (key === 'logout') {
    store.commit('saveUserInfo', '')
    router.push({ path: '/login', })
  }
}

const expandOrCollapse = () => {

  isCollapse.value = !isCollapse.value

}
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
    // background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: 0.5s;

    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      font-size: 18px;

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
    }

    .main-page {
      background-color: #fff;
      height: 100%;
    }
  }
}
</style>
