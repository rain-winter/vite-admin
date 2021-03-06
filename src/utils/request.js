/**
 * axios 二次封装
 */
import axios from 'axios'
import {
	ElMessage
} from 'element-plus'
import config from '../config'
import router from '../router' // 引入route 可以在js页面跳转到vue页面
import storage from './storage'

const TOKEN_INVALID = 'token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常'

// 创建axios对象，添加全局配置
const service = axios.create({
	baseURL: config.baseApi,
	timeout: 20000,
})

// 请求拦截
service.interceptors.request.use((req) => {
	const headers = req.headers
	// TODO 获取token
	const {
		token
	} = storage.getItem('userInfo') || ''
	// console.log('token', token)

	if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
	return req
})
// 相应拦截
service.interceptors.response.use((res) => {
	const {
		code,
		data,
		msg
	} = res.data
	// 拦截了状态码是200
	if (code === 200) {
		return data
	} else if (code === 40001) {
		ElMessage.error(TOKEN_INVALID)
		setTimeout(() => {}, 1500)
		router.push({
			path: '/login'
		})
		return Promise.reject(TOKEN_INVALID)
	} else {
		// 对状态码不是200的进行捕获
		// 所以后续接口可以不考虑接口的状态
		ElMessage.error(msg || NETWORK_ERROR)
		return Promise.reject(msg || NETWORK_ERROR)
	}
})

/**
 * 请求核心函数
 * @param {*} options  请求配置
 * @returns
 */
function request(options) {
	options.method = options.method || 'get'
	if (options.method.toLowerCase() === 'get') {
		options.params = options.data
	}

	let isMock = config.mock

	// 如果options里有mock变量，就去mock
	if (typeof options.mock != 'undefined') {
		//config.mock=options.mock 此时optons.mock会把config.mock覆盖
		isMock = options.mock
	}

	if (config.env == 'prod') {
		service.defaults.baseURL = config.baseApi
	} else {
		service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
	}

	return service(options)
};
['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
	request[item] = (url, data, options) => {
		return request({
			url,
			data,
			method: item,
			...options,
		})
	}
})

export default request