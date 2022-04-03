<template>
  welcome 主界面
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
    <el-button>中文</el-button>
  </el-row>
</template>
<script>
export default {
  name: 'Welcome',
  mounted () {
    this.$request({
      method: 'post',
      url: '/login',
      data: {
        userName: 'rain',
        password: '123'
      }
    }).then(res => {
      console.log(res)
    })
  }
}
</script>