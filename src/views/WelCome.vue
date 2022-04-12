<template>
	<div class="welcome">
		<div class="content">
			<div class="sub-title">欢迎登录</div>
			<div class="title">RAIN后台管理系统</div>
			<div class="desc">VUE3.2+ElementPlus+Node+MongoDB</div>
		</div>
		<div class="img"></div>
	</div>
</template>
<script>
export default {
	name: 'Welcome',
	mounted() {}
};
</script>
<style lang="scss">
.welcome {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	.content {
		// 相对与自己定位
		position: relative;
		bottom: 40px;
		.sub-title {
			font-size: 30px;
			line-height: 42px;
			color: #333;
		}
		.title {
			font-size: 42px;
			line-height: 62px;
			color: #0097e6;
		}
		.desc {
			text-align: right;
			font-size: 14px;
			color: #999;
		}
	}
	.img {
		width: 371px;
		height: 438px;
		margin-left: 105px;
		background-image: url(../assets/images/welcome.png);
	}
}
</style>
