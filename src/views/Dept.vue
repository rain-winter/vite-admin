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
    <!-- 展示 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
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
    <!-- 添加|编辑弹框 -->
    <el-dialog v-model="showMadel" :title="action == 'create' ? '创建部门' : '编辑部门'">
      <el-form
        :model="deptForm"
        ref="deptForm"
        :rules="rules"
        label-width="120px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            placeholder="请选择上级部门"
            :options="deptList"
            v-model="deptForm.parentId"
            clearable
            filterable
            :show-all-levels="true"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'deptName',
              expandTrigger: 'hover',
              multiple: true,
              checkStrictly: true,
            }"
            @change=""
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
            size="normal"
            clearable
            @change=""
          />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="deptForm.user"
            placeholder="请选择部门负责人"
            size="normal"
            clearable
            @change=""
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" size="normal">
          <el-input placeholder="请输入负责人邮箱" v-model="deptForm.userEmail" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="diag-footer">
          <el-button type="primary" size="default" @click="handleClose">取消</el-button>
          <el-button type="primary" size="default" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
      deptForm: {}, // 弹框的表单
      deptList: [], // 部门列表
      rules: {
        parentId: [
          {
            required: true,
            message: '轻松选择上级部门',
          },
        ],
      },
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      userList: [],
      action: 'create', // 添加|删除|编辑 create edit del
      showMadel: false, // 弹框
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
    this.getUserList()
  },
  methods: {
    async getDeptList() {
      let list = await this.$api.getDeptList()
      this.deptList = list
    },
    async getUserList(){
     let list = await this.$api.getAllUserList()
     this.userList = list
    },
    handleOpen() {
      this.action = 'create'
      this.showMadel = true
    },
    handleEdit(row) {
      this.action = 'edit'
      this.showMadel = true
    },
    handleDel(id) {
      this.action = 'del'
      this.showMadel = true
    },
    handleSubmit() {},
    // 重置表单
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 取消
    handleClose() {},
  },
}
</script>
<style lang="scss"></style>
