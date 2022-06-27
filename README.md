# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

# VUE开发小技巧

## 角色

~~~txt
role  0 管理员  1 普通用户
state 0 所有    1 在职     2 离职    3 试用期
menuType 1菜单 2 按钮
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
~~~

## ref赋值

再setup函数中。

~~~js
const roleList = ref([])

roleList.value =  await $api.getRoleList() // 错误，不可以直接赋值

let list =  await $api.getRoleList() // 接收再赋值
roleList.value = list // 正确
~~~

## 编辑时给表单赋值

~~~js
import { nextTick } from 'vue'
const userForm = reactive({})
const handleEdit(row){
    action.value = 'edit'
    showModal.value=true
    await nextTick() // 在渲染出弹框后再赋值。（赋值快于dom渲染）
    Object.assign(userForm,row) // 讲row的值拷贝到userForm
}
~~~

## vue3全局挂载

~~~js
// 这里时main.js
import api from ''
app.provide('$api', api) // 将api变量挂载到$api
~~~

~~~js
// .vue
import { inject } from 'vue'
const $api = inject('$api') // 引用全局的$api
$api.login().then(res=>{})
~~~



## yarn 更新依赖包

`yarn upgrade-interactive --latest`

# mongoose

## 模型

~~~js
const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
  menuType: Number, // 菜单类型
  menuName: String, // 菜单名称
  menuCode: String, // 菜单名字
  path: String, // 路由地址
  icon: String, // 图标
  component: String, // 组件地址
  menuState: Number, //菜单状态
  parentId: [mongoose.Types.ObjectId], // 父级菜单的id
  "createTime": {
    type: Date,
    default: Date.now()
  },
  "updateTime": {
    type: Date,
    default: Date.now()
  },
})

/**
 * (1) 导出模型 ， 叫做menus
 * (2) menuSchema
 * (3) menus 创建数据库集合menus
 */
// 需要注意的是只有当第一个参数是menu单数，才会在数据库里创建menus集合
module.exports = mongoose.model('menu', menuSchema)
~~~



## 主键递增

新建`counters`表。里面存放`userId`和`sequence_value`。其中sequence_value从1开始，每当我们插入用户时，让其＋1作为用户id。

~~~js
const doc = await Counter.findOneAndUpdate({
    _id: 'userId'
},{
    $inc: {
        sequence_value: 1 // 让其新增1
    }
},{ new: true })
~~~

## Model.create()

~~~js
const { _id, action, ...params} = ctx.request.body
await Menu.create(params)
~~~

## Model.findByIdAndUpdate()

~~~js
params.updateTime = new Date()
await Menu.findByIdAndUpdate(_id, params) // params 是其余字段
~~~

## 级联删除

~~~js
await Menu.findByIdAndRemove(_id) // 删除一条
// 删除parentId含有 _id 的所有数据
Menu.deleteMany({
    parentId: {
        $all: [_id]
    }
})
~~~

# RABC

> Role-Based Access Control

什么是工作流：部分或整体业务实现计算机环境下的自动化。

那些场景会用到工作流：加班、报销、出差、采购、报价、付款、培训。

工作流七要素：角色、场景、节点、环节、必要信息、通知、操作

角色：发起人、审批人

场景：请假、出差

节点：审批单节点、多节点

环节：审批单环节、多环节

必要信息：申请理由、申请时长

通知：申请人、审批人

操作：未审批、已驳回、已审批

