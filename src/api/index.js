/**
 * aoi 管理
 */
import request from '../utils/request'
import { ElMessage } from 'element-plus'

export default {
	login (params) {
		return request({
			method: 'post',
			url: '/users/login',
			data: params
		})
	},
	// 首页消息
	noticeCount () {
		return request({
			method: 'get',
			url: '/leave/count',
			data: {},
			mock: true
		})
	},
	getMenuList () {
		return request({
			method: 'get',
			url: '/menu/list',
			mock: true
		})
	},
	getUserList (params) {
		return request({
			method: 'get',
			url: '/users/list',
			data: params,
			mock: false
		})
	},
	userDel (params) {
		return request({
			method: 'post',
			url: '/users/delete',
			data: params,
			mock: true
		})
	},
	getRoleList () {
		return request({
			method: 'get',
			url: '/roles/allList',
			mock: true
		})
	},
	getDeptList () {
		return request({
			url: '/dept/list',
			method: 'get',
			mock: true
		})
	},
	userSubmit () {
		return request({
			url: '/users/operate',
			method: 'post',
			mock: true
		})
	}
}
