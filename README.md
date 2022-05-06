# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

# VUE开发小技巧

## 角色

~~~txt
role  0 管理员  1 普通用户
state 0 所有    1 在职     2 离职    3 试用期
~~~

## 格式化

~~~txt
<el-table :formatter="formatter" />
~~~

~~~json
	{
        label: "用户角色",
        prop: "role",
        formatter(row, column, val) {
          return {
            0: "管理员",
            1: "普通用户",
          }[val];
        },
      },
~~~

~~~vue
<el-cascader
   v-model="userForm.deptId"
   :options="deptList"
   :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
   clearable
   placeholder="请选择部门">
</el-cascader>
//
~~~

## ref赋值

再setup函数中。

~~~js
const roleList = ref([])

roleList.value =  await $api.getRoleList() // 错误

let list =  await $api.getRoleList() // 接收再赋值
roleList.value = list // 正确
~~~

## 编辑时给表单赋值

~~~js
import { nextTick } from 'vue'
const handleEdit(row){
    action.value = 'edit'
    showModal.value=true
    await nextTick() // 在渲染出弹框后再赋值。（赋值快于dom渲染）
    Object.assign(userForm,row) // 讲row的值拷贝到userForm
}
~~~

