<template>
  <div class="user-manag">
    <div class="query-form">
      <!-- prop 是数据库的字段 -->
      <el-form :inline="true" :model="user" ref="formRef">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state" placeholder="请选择">
            <el-option :value="0" lablel="所有"></el-option>
            <el-option :value="1" lablel="在职"></el-option>
            <el-option :value="2" lablel="离职"></el-option>
            <el-option :value="3" lablel="审批"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset(formRef)">重置</el-button>
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
            <el-button @click="handleEdit()" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
export default {
  name: "user",
  setup() {
    const { $api } = getCurrentInstance().appContext.config.globalProperties;
    const user = reactive({
      state: 1,
    });
    const age = ref(3);
    let userList = ref([]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    const formRef = ref();

    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名称",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
      },
      {
        label: "用户状态",
        prop: "state",
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    const getUserList = async () => {
      let params = { ...user, ...pager };
      try {
        const { list, page } = await $api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(() => {
      getUserList();
    });

    // 查询
    const handleQuery = () => {
      getUserList();
    };
    const handleReset = (e) => {
      e.resetFields();
    };

    // 分页时间
    const handleCurrentChange = (currentPage) => {
      pager.pageNum = currentPage;
      getUserList();
    };
    // TODO 7.4
    return {
      user,
      age,
      columns,
      userList,
      pager,
      formRef,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.action {
  padding: 20px;
}
</style>
