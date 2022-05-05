# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)



## 注释

~~~txt
角色
role 0 管理员  1 普通用户

<el-table :formatter="">
formatter(row, columns, val) {}
~~~

~~~json
用户
0 所有 1 在职 2 离职 3 试用期
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

