/**
 * 环境配置封装
 */
const env =
	import.meta.env.MODE || 'prod'
const envConfig = {
	dev: {
		baseApi: '/api',
		// mockApi: 'https://www.fastmock.site/mock/40686df6be86cb9ab3c58f6782762add/api', // 自己得mock地址
		mockApi: 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api' // 老师得mick地址

	},
	test: {
		baseApi: '',
		mockApi: '',
	},
	prod: {
		baseApi: '',
		mockApi: '',
	},
}
export default {
	env: env,
	mock: false,
	stroageSpace: 'manager',
	...envConfig[env], // 根据不同的环境变量解构出对应的地址参数
}
