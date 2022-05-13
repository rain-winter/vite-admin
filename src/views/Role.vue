<template>
  <div class="role-manage">
    <div class="query-form">
      <!-- prop 是数据库的字段 -->
      <el-form :inline="true" :model="queryForm" ref="formRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button @click="handleAdd" type="primary">创建</el-button>
      </div>
      <el-table
        style="width: 100% !important"
        :data="roleList"
        row-key="_id"
        stripe
        border
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          width="180"
        />
        <el-table-column
          fixed="right"
          align="center"
          label="Operations"
          width="250"
        >
          <template #default="scope">
            <el-button
              text
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button text size="small">设置权限</el-button>
            <el-button
              @click="handleDelete(scope.row._id)"
              type="danger"
              text
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination mt-4"
        background
        layout="->,prev, pager, next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增 -->
    <el-dialog title="按钮新增" draggable v-model="showModal">
      <el-form
        :model="roleForm"
        label-width="auto"
        label-position="left"
        :rules="rules"
        ref="diagForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(diagForm)">Cancel</el-button>
          <el-button @click="handleSubmit(diagForm)" type="primary"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, inject, reactive, nextTick, toRaw } from 'vue'
import message from '../utils/message'
import utils from '../utils/utils'
const $api = inject('$api')

const roleList = ref([]) // 角色列表

const queryForm = ref({
  roleName: '',
})

let roleForm = reactive({})

let pager = reactive({
  total: 0,
  pageSize: 10,
})

const formRef = ref('') // 表单实例
const diagForm = ref('') // 弹框表单实例
const showModal = ref(false)
const action = ref('create')

const columns = ref([
  {
    label: '角色名称',
    prop: 'roleName',
    width: 180,
  },
  {
    label: '备注',
    prop: 'remark',
  },
  {
    label: '权限列表',
    prop: 'menuType',
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, val) {
      return utils.formateDate(new Date(val))
    },
  },
])

const rules = reactive({
  roleName: [
    {
      required: true,
      message: '角色不能为空',
    },
  ],
})

/**
 * 获取按钮列表
 */
const getRoleList = async () => {
  try {
    const { list, page } = await $api.getRoleList(queryForm.value)
    roleList.value = list
    pager.total = page.total
  } catch (error) {
    throw new Error(error)
  }
}
getRoleList() // 获取按钮列表

// 重置表单
const handleReset = (e) => {
  e.resetFields()
}

// 关闭弹框
const handleClose = (e) => {
  handleReset(e)
  showModal.value = false
}

const handleAdd = async () => {
  action.value = 'create'
  showModal.value = true
}

const handleEdit = async (row) => {
  action.value = 'edit'
  showModal.value = true
  await nextTick()
  Object.assign(roleForm, row)
}

const handleSubmit = (diagForm) => {
  diagForm.validate(async (valid) => {
    if (valid) {
      let params = { ...roleForm, action: action.value }
      let res = await $api.roleOperate(params)
      if (res) {
        showModal.value = false
        handleReset(diagForm)
        getRoleList()
      }
    }
  })
}

// 删除
const handleDelete = async (_id) => {
  await $api.roleOperate({ _id, action: 'delete' })
  message.success('删除成功')
  getRoleList()
}

// 分页
const handleCurrentChange = () => {}
</script>
<style lang="scss" scoped>
.action {
  padding: 20px;
}
</style>
