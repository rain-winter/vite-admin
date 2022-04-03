<template>login</template>
<script>
export default {
  name: 'Login',
  mounted () {
    // this.$request({
    //   method: 'get',
    //   url: '/article',
    // }).then(res => {
    //   console.log(res)
    // })

    this.$request.get('/article', { name: 'jack' }, { mock: true }).then(res => {
      console.log(res)
    })
  },
}
</script>