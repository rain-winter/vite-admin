<template>
  <div class="dept-manager">
    <!-- 查询表单 -->
    <div class="query-form">
      <el-form :inline="true" ref="queryForm" :model="queryForm">
        <el-form-item label="部门名称">
          <el-input placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item>
          <el-button @click="getDeptList">查询</el-button>
          <el-button @click="handleReset(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }">
      <!-- 直接将width、formatter挂在上去 -->
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dept',
  data() {
    return {
      // 查询表单
      queryForm: {
        deptName: '',
      },
      deptList: [], // 部门列表
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      columns: [
        {
          label: '部门名称',
          prop: 'deptName',
        },
        {
          label: '负责人',
          prop: 'userName',
        },
        {
          label: '更新时间',
          prop: 'updateTime',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
      ],
    }
  },
  mounted() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      let list =await this.$api.getDeptList()
      this.deptList = list
    },
    // 重置表单
    handleReset(form) {
      this.$refs[form].resetFields()
    },
  },
}
</script>
<style lang="scss"></style>
