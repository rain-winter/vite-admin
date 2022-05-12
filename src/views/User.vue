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
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="审批" :value="3" />
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
        <el-button @click="handleCreate" type="primary">新增</el-button>
        <el-button @click="handlePatchDel" type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          width="180"
        />
        <el-table-column fixed="right" label="Operations" width="140">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" text size="small"
              >编辑</el-button
            >
            <el-button
              @click="handleDelete(scope.row)"
              type="danger"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
      />
    </div>
  </div>

  <el-dialog title="用户新增" v-model="showModal">
    <el-form
      :model="userForm"
      label-width="auto"
      label-position="left"
      :rules="rules"
      ref="diagForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="userForm.userName"
          :disabled="action == 'edit'"
          placeholder="请输入用户名称"
        />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="userEmail">
        <el-input
          v-model="userForm.userEmail"
          :disabled="action == 'edit'"
          placeholder="请输入用户邮箱"
        >
          <template #append> @imooc.com </template>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input v-model="userForm.job" placeholder="请输入岗位" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="userForm.state">
          <el-option :value="1" label="在职" />
          <el-option :value="2" label="离职" />
          <el-option :value="3" label="试用期" />
        </el-select>
      </el-form-item>

      <el-form-item label="系统角色" prop="roleList">
        <el-select
          style="width: 100%"
          multiple
          v-model="userForm.roleList"
          placeholder="请选择用户系统角色"
        >
          <el-option
            v-for="role in roleList"
            :key="role._id"
            :label="role.roleName"
            :value="role._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="userForm.deptId"
          :options="deptList"
          :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
          clearable
          placeholder="请选择部门"
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
</template>

<script>
import {
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRaw,
  nextTick,
} from 'vue'
import utils from '../utils/utils'
import message from '../utils/message'
import $api from '../api/index'
export default {
  name: 'user',
  setup() {
    // const { $api } = getCurrentInstance().appContext.config.globalProperties
    const user = reactive({
      state: 1,
    })

    let userList = ref([])
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    })

    const formRef = ref()
    const diagForm = ref()
    let checkUserIds = ref([]) // 选中用户列表的对象

    const showModal = ref(false) // 弹框显示
    // 添加表单
    const userForm = reactive({
      state: 3,
    })

    const roleList = ref([]) // 所有角色列表
    const deptList = ref([]) // 所有部门列表

    const action = ref('add')

    const rules = reactive({
      // 表单校验规则
      userName: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      userEmail: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur',
        },
      ],
      deptId: [
        {
          required: true,
          message: '请输入部门',
          trigger: 'blur',
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: '请输入正确手机号',
          trigger: 'blur',
        },
      ],
    })

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
        label: '岗位',
        prop: 'job',
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, val) {
          return {
            0: '管理员',
            1: '普通用户',
          }[val]
        },
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, val) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期',
          }[val]
        },
      },
      {
        label: '注册时间',
        prop: 'createTime',
        formatter(row, column, val) {
          return utils.formateDate(new Date(val))
        },
      },
      {
        label: '最后登录时间',
        prop: 'updateTime',
        formatter(row, column, val) {
          return utils.formateDate(new Date(val))
        },
      },
    ])

    onMounted(() => {
      getUserList()
      getDeptList()
      getRoleList()
    })
    const getUserList = async () => {
      let params = { ...user, ...pager }
      try {
        const { list, page } = await $api.getUserList(params)
        userList.value = list
        pager.total = page.total
        console.log('page.total=>', page.total)
      } catch (err) {
        console.log(err)
      }
    }
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置
    const handleReset = (e) => {
      e.resetFields()
    }

    // 用户单个删除
    const handleDelete = async (row) => {
      console.log(row.userId)
      const res = await $api.userDel({ userIds: [row.userId] })
      message.success('删除成功')
    }

    // 批量删除
    const handlePatchDel = async () => {
      if (checkUserIds.value.length == 0) {
        alert('请选择要删除的用户')
      }
      let res = await $api.userDel({
        userIds: checkUserIds.value,
      })
      // if (res.nModified > 0) {
      //   alert('删除成功')
      //   getUserList()
      // } else {
      //   alert('删除失败')
      // }
      message.success('删除成功')
    }

    // 处理全选给checkUserIds赋值
    const handleSelectionChange = (list) => {
      // 选择的数据集
      let arr = []
      list.map((item) => {
        arr.push(item.userId)
      })
      checkUserIds.value = arr
    }
    // 创建用户
    const handleCreate = () => {
      action.value = 'add'
      showModal.value = true
    }

    const getDeptList = async () => {
      let list = await $api.getDeptList()
      deptList.value = list
      console.log(list)
    }

    const getRoleList = async () => {
      // TODO 给ref声明地数组赋值。
      let list = await $api.getRoleList()
      roleList.value = list
    }

    //关闭提交弹框
    const handleClose = (diagForm) => {
      showModal.value = false
      handleReset(diagForm)
    }

    /**
     * 新增用户
     * 需要传递 当前表单
     */
    const handleSubmit = (diagForm) => {
      diagForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm)
          params.action = action.value // 添加还是删除
          params.userEmail += '@imooc.com'
          let res = await $api.userSubmit(params)
          if (res) {
            showModal.value = false
            message.success(`${action.value == 'add' ? '添加' : '编辑'}成功`)
            getUserList()
            handleReset(diagForm)
          }
        }
      })
    }

    const handleEdit = async (row) => {
      action.value = 'edit'
      showModal.value = true
      await nextTick()
      Object.assign(userForm, row)
    }

    // 分页时间
    const handleCurrentChange = (currentPage) => {
      pager.pageNum = currentPage
      getUserList()
    }
    return {
      user,
      columns,
      userList,
      pager,
      formRef,
      diagForm,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDel,
      handleSelectionChange,
      handleCreate,
      getDeptList,
      getRoleList,
      handleClose,
      handleSubmit,
      handleEdit,
    }
  },
}
</script>

<style lang="scss" scoped>
.action {
  padding: 20px;
}
.pagination {
  text-align: right !important;
  padding: 10px;
}
</style>
