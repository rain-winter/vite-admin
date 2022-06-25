<template>
  <div class="menu-manag">
    <div class="query-form">
      <!-- prop 是数据库的字段 -->
      <el-form :inline="true" :model="queryForm" ref="formRef">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="queryForm">
          <el-select v-model="queryForm.menuState" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleReset(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button @click="handleAdd(1)" type="primary">新增菜单</el-button>
      </div>
      <el-table :data="menuList" row-key="_id" border>
        <el-table-column
          v-for="(item, index) in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          width="180"
        />
        <el-table-column fixed="right" label="Operations" width="195">
          <template #default="scope">
            <el-button
              @click="handleAdd(2, scope.row)"
              type="primary"
              size="small"
              v-if="scope.row.menuType==1"
              >新增</el-button
            >
            <!-- <div v-if=
            "scope.row.menuType==2" style="width:48px">12</div> -->
            <el-button @click="handleEdit(scope.row)" text size="small"
              >编辑</el-button
            >
            <el-button
              @click="handleDelete(scope.row._id)"
              type="danger"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 按钮新增 -->
  <el-dialog title="按钮新增" draggable v-model="showModal">
    <el-form
      :model="menuForm"
      label-width="auto"
      label-position="left"
      :rules="rules"
      ref="diagForm"
    >
      <el-form-item label="父级菜单" prop="parentId">
        <el-cascader
          v-model="menuForm.parentId"
          :options="menuList"
          :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
          clearable
        />
        <span style="color: #999; margin-left: 10px"
          >不选，则直接创建一级菜单</span
        >
      </el-form-item>

      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="menuForm.menuType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="menuForm.menuType == 1 ? '菜单名称' : '按钮名称'"
        prop="menuName"
      >
        <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
      </el-form-item>

      <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType == 1">
        <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
      </el-form-item>

      <el-form-item label="路由地址" prop="path" v-if="menuForm.menuType == 1">
        <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
      </el-form-item>

      <el-form-item
        label="权限标识"
        prop="menuCode"
        v-if="menuForm.menuType == 2"
      >
        <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
      </el-form-item>

      <el-form-item
        label="组件路径"
        prop="component"
        v-if="menuForm.menuType == 1"
      >
        <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
      </el-form-item>

      <el-form-item
        :label="menuForm.menuType == 1 ? '菜单状态' : '按钮状态'"
        prop="menuState"
      >
        <el-radio-group v-model="menuForm.menuState">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
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

<script setup>
import { ref, inject, reactive, nextTick, toRaw } from 'vue'
import message from '../utils/message'
import utils from '../utils/utils'
const $api = inject('$api')

const queryForm = ref({
  menuState: 1,
})
let menuForm = reactive({
  parentId: [null],
  menuType: 1, // 菜单名称/按钮名称
  menuState: 1, // 正常还是停用
}) // 添加按钮的表单
const showModal = ref(false) // 弹框
const action = ref('') // 添加/编辑
const formRef = ref('') // 表单实例
const diagForm = ref() // 添加表单实例
const menuList = ref([]) // 按钮列表

// 验证规则
const rules = reactive({
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: ['blur'],
    },
    {
      min: 2,
      max: 10,
      message: '长度在2到8个字符',
      trigger: ['blur'],
    },
  ],
})

const columns = ref([
  {
    label: '菜单名称',
    prop: 'menuName',
    width: 180,
  },
  {
    label: '图标',
    prop: 'icon',
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    formatter(row, column, val) {
      return {
        1: '菜单',
        2: '按钮',
      }[val]
    },
  },
  {
    label: '权限标识',
    prop: 'menuCode',
  },
  {
    label: '路由地址',
    prop: 'path',
  },
  {
    label: '组件路径',
    prop: 'component',
  },
  {
    label: '菜单状态',
    prop: 'menuState',
    formatter(row, column, val) {
      return {
        1: '正常',
        2: '停用',
      }[val]
    },
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, val) {
      return utils.formateDate(new Date(val))
    },
  },
])

/**
 * 重置表单
 * @param {*} e 表单实例
 */
const handleReset = (e) => {
  e.resetFields()
}
/**
 * 按钮 - 表单提交
 * @param {*} diagForm 表单实例，用于重置表单
 */
const handleSubmit = (diagForm) => {
  diagForm.validate(async (valid) => {
    if (valid) {
      // 结构时，由于action是ref代理的，所以要 action: action.value
      let params = { ...menuForm, action: action.value }
      await $api.menuSubmit(params)
      showModal.value = false
      message.success('操作成功') // 消息弹框
      handleReset(diagForm) // 重置表单
      getMenuList() // 重新获取按钮列表
    }
  })
}

/**
 * 关闭弹框
 * @param {*} e 表单实例
 */
const handleClose = (e) => {
  handleReset(e)
  showModal.value = false
}

/**
 * 按钮添加
 * @param {*} type 1/2 1 是最上的添加 2是在行里添加
 * @param {*} row  type=2 时，行数据
 */
const handleAdd = async (type, row) => {
  showModal.value = true
  action.value = 'add'
  if (type == 2) {
    await nextTick()
    menuForm.parentId = [...row.parentId, row._id].filter((item) => item)
  }
}

/**
 * 编辑
 * @param {*} row 当前行数据
 */
const handleEdit = async (row) => {
  showModal.value = true
  action.value = 'edit'
  await nextTick() // 在渲染出弹框后再赋值。（赋值快于dom渲染）
  Object.assign(menuForm, row)
}

/**
 * 删除
 * @param {*} _id
 */
const handleDelete = async (_id) => {
  await $api.menuSubmit({
    _id,
    action: 'delete',
  })
  message.success('删除成功')
  getMenuList()
}

/**
 * 获取按钮列表
 */
const getMenuList = async () => {
  try {
    const res = await $api.getMenuList(queryForm.value)
    menuList.value = res
  } catch (error) {
    throw new Error(error)
  }
}
getMenuList() // 获取按钮列表
</script>
