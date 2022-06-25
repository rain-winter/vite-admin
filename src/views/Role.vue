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
    <!-- 基本表格 -->
    <div class="base-table">
      <div class="action">
        <el-button @click="handleAdd" type="primary">创建</el-button>
      </div>
      <el-table style="width: 100% !important" :data="roleList" row-key="_id" stripe border>
        <el-table-column show-overflow-tooltip v-for="(item, index) in columns" :key="item.prop" :prop="item.prop"
          :label="item.label" :formatter="item.formatter" width="180" />
        <el-table-column fixed="right" align="center" label="Operations" width="250">
          <template #default="scope">
            <el-button text type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button @click="handleOpenPermission(scope.row)" text size="small">设置权限</el-button>
            <el-button @click="handleDelete(scope.row._id)" type="danger" text size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination mt-4" background layout="->,prev, pager, next" :total="pager.total"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 新增 弹框 -->
    <el-dialog title="按钮新增" draggable v-model="showModal">
      <el-form :model="roleForm" label-width="auto" label-position="left" :rules="rules" ref="diagForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="roleForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(diagForm)">Cancel</el-button>
          <el-button @click="handleSubmit(diagForm)" type="primary">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 设置权限弹框 -->
    <el-dialog title="设置权限" draggable v-model="showPermission">
      <el-form label-width="auto" ref="permissionForm">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree :data="menuList" ref="permissionTreeRef" show-checkbox highlight-current node-key="_id"
            default-expand-all :props="{ label: 'menuName' }"></el-tree>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">Cancel</el-button>
          <el-button @click="handlePerssionSubmit(permissionTreeRef)" type="primary">Confirm</el-button>
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
const menuList = ref([])

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
const permissionTreeRef = ref() // 树实例
const permissionForm = ref()
const showModal = ref(false) // 新增弹框
const showPermission = ref(false) // 权限展示
const curRoleName = ref('') //
const curRoleId = ref('')
const action = ref('create') // 添加/删除

let actionMap = reactive({})

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
    prop: 'permissionList',
    width: 200,
    // 格式化
    formatter: (row, column, val) => {
      // halfCheckedKeys是按钮
      let list = val.halfCheckedKeys
      let names = []
      list.map((key) => {
        let name = actionMap[key]
        if (key && name) names.push(name)
      })
      return names.join(',')
    },
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, val) {
      return utils.formateDate(new Date(val))
    },
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    formatter(row, column, val) {
      return utils.formateDate(new Date(val))
    },
  },
])

// 验证，角色名字是必填的
const rules = reactive({
  roleName: [
    {
      required: true,
      message: '角色不能为空',
    },
  ],
})

// 设置权限 弹框
const handleOpenPermission = async (row) => {
  curRoleId.value = row._id
  curRoleName.value = row.roleName
  showPermission.value = true
  // 获取当前的权限
  let { checkedKeys } = row.permissionList
  await nextTick()
  permissionTreeRef.value.setCheckedKeys(checkedKeys)
}

// 设置权限
const handlePerssionSubmit = async (treeRef) => {
  //返回当前选中节点的数组
  let nodes = treeRef.getCheckedNodes()
  // 返回目前半选中的节点的 key 所组成的数组
  let halfKeys = treeRef.getHalfCheckedKeys()
  // console.log('halfKey', halfKeys)
  let checkedKeys = [] // 按钮
  let parentKeys = [] // 父节点 - 菜单

  // 分离按钮和菜单
  nodes.map((node) => {
    if (!node.children) {
      // 没有children，说明是最后一级按钮
      checkedKeys.push(node._id)
    } else {
      parentKeys.push(node._id)
    }
  })

  let params = {
    _id: curRoleId.value,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: parentKeys.concat(halfKeys),
    },
  }
  await $api.updatePermission(params)
  showPermission.value = false
  message.success('设置成功')
  getRoleList()
}

// 递归遍历， 把key转换成字典
const getActionMap = (list) => {
  let actionMapTmp = {}
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop()
      if (item.children && item.action) {
        actionMapTmp[item._id] = item.menuName
      }
      // 最后一级
      if (item.children && !item.action) {
        deep(item.children)
      }
    }
  }
  // JSON.parse JSON.stringfy是形成一个新的对象
  // 防止原数据被改变
  deep(JSON.parse(JSON.stringify(list)))
  Object.assign(actionMap, actionMapTmp) // 将actionMapTMP拷贝到actionMap
}

// 获取角色列表
const getRoleList = async () => {
  try {
    const { list, page } = await $api.getRoleList({ ...queryForm.value, ...pager })
    roleList.value = list
    pager.total = page.total
  } catch (error) {
    throw new Error(error)
  }
}

// 获取按钮列表
const getMenuList = () => {
  try {
    $api.getMenuList().then(list => {
      menuList.value = list
      getActionMap(list)

    })
    console.log('list', menuList.value)
  } catch (error) {
    throw new Error(error)
  }
}
getMenuList() // 获取按钮列表
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
/**
 * 编辑
 * @param() 当前行
 */
const handleEdit = async (row) => {
  action.value = 'edit'
  showModal.value = true
  await nextTick()
  Object.assign(roleForm, row)
}

// 增删改查的提交
const handleSubmit = (diagForm) => {
  diagForm.validate(async (valid) => {
    if (valid) {
      // api的参数，roleForm和action
      let params = { ...roleForm, action: action.value }
      let res = await $api.roleOperate(params)
      console.log(res)
      if (res) {
        showModal.value = false // 关闭弹框
        handleReset(diagForm) // 重置表单
        getRoleList() // 获取列表
      }
    }
  })
}

// 删除角色
const handleDelete = async (_id) => {
  await $api.roleOperate({ _id, action: 'delete' })
  message.success('删除成功')
  getRoleList()
}

// 分页
const handleCurrentChange = () => { }
</script>
<style lang="scss" scoped>
.action {
  padding: 20px;
}
</style>
