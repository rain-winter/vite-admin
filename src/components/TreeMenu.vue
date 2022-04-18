<template>
  <h2>tree - menu</h2>
  <template v-for="menu in userMenu">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :index="menu.path"
      :key="menu._id"
    >
      <template #title>
        <i :class="menu.icon"></i>
        <span>{{ menu.menuName }}</span>
      </template>

      <!-- 递归组件，再次循环判断子菜单 -->
      <TreeMenu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu.menuName"
    >
      <span>{{ menu.menuName }}</span>
    </el-menu-item>
  </template>
</template>
{{ userMenu }}
<script>
export default {
  name: 'TreeMenu',
  props: ['userMenu'],
  mounted() {
    this.conso()
  },
  methods: {
    conso() {
      console.log('tree')
      console.log('this.userMenu', this.userMenu)
      this.userMenu.map((item) => {
        console.log(item)
      })
    },
  },
}
</script>
