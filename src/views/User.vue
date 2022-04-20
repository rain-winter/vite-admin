<template>
  <div class="user-manag">
    <div class="query-form">
      <el-form :inline="true" :model="user">
        <el-form-item>
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="user.state">
            <el-option :value="0" lablel="所有"></el-option>
            <el-option :value="1" lablel="在职"></el-option>
            <el-option :value="2" lablel="离职"></el-option>
            <el-option :value="3" lablel="审批"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          width="180"
        />
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default>
            <el-button type="text" size="small" @click="handleClick"
              >编辑</el-button
            >
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
export default {
  name: 'user',
  setup() {
    const user = reactive({})
    const age = ref(3)
    const userList = reactive([
      {
        userId: 12,
      },
    ])
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId',
      },
      {
        label: '用户名称',
        prop: 'userName',
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
      },
      {
        label: '用户角色',
        prop: 'role',
      },
      {
        label: '用户状态',
        prop: 'state',
      },
      {
        label: '注册时间',
        prop: 'createTime',
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
      },
    ])

    onMounted(() => {
      console.log('init')
    })

    return {
      user,
      age,
      columns,
      userList,
    }
  },
}
</script>

<style lang="scss" scoped>
.action{
  padding: 20px;
}
</style>
