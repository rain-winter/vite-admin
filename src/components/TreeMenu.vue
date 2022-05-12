<template>
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
        <el-icon><setting /></el-icon>

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
      <i :class="menu.icon"></i>
      <template #title>
        <span>{{ menu.menuName }}</span>
      </template>
    </el-menu-item>
  </template>
</template>
<script>
import { Setting } from '@element-plus/icons-vue'
export default {
  name: 'TreeMenu',
  props: ['userMenu'],
  components: {
    Setting,
  },
  mounted() {
    // console.log(this.userMenu)
  },
}
</script>
