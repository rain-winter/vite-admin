<template>
	<div class="basic-layout">
		<div class="nav-side">
			<!-- 系统logo -->
			<div class="logo">
				<img src="../assets/logo.png" />
				<span>Manager</span>
			</div>

			<!-- 导航按钮 -->
			<div class="menu">
				<el-menu default-active="2" class="el-menu-vertical-demo" :collapse="false">
					<el-sub-menu index="1">
						<template #title>
							<el-icon><icon-menu /></el-icon>
							<span>Navigator One</span>
						</template>
						<el-menu-item-group>
							<template #title>
								<span>Group One</span>
							</template>
							<el-menu-item index="1-1">item one</el-menu-item>
						</el-menu-item-group>
						<el-menu-item-group title="Group Two"><el-menu-item index="1-3">item three</el-menu-item></el-menu-item-group>
					</el-sub-menu>
				</el-menu>
			</div>
		</div>
		<div class="content-right">
			<div class="nav-top">
				<div class="nav-left">
					<el-icon style="cursor: pointer;"><fold /></el-icon>
					<div class="bread">面包屑</div>
				</div>

				<div class="user">admin</div>
			</div>
			<div class="wrapper">
				<div class="main-page"><router-view /></div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { Document, Menu as IconMenu, Location, Setting, Fold } from '@element-plus/icons-vue';
</script>
<style lang="scss">
.basic-layout {
	position: relative;
	.nav-side {
		position: absolute;
		width: 200px;
		height: 100vh;
		background-color: #001529;
		color: #fff;
		overflow-y: auto;
		transition: 0.5s;
		.logo {
			height: 50px;
			display: flex;
			align-items: center;
			font-size: 18px;
			img {
				margin: 0 16px;
				width: 32px;
				height: 32px;
			}
		}
	}
	.content-right {
		margin-left: 200px;
		.nav-top {
			height: 50px;
			line-height: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border: 1px solid #ddd;
			padding: 0 20px;
			.nav-left {
				display: flex;
				align-items: center;
				margin-right: 10px;
				.bread{
					margin-left: 10px;
				}
			}
		}
		.wrapper {
			background-color: #eef0f3;
			padding: 20px;
			height: calc(100vh - 50px);
		}
		.main-page {
			background-color: #fff;
			height: 100%;
		}
	}
}
</style>
