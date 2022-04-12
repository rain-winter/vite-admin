/**
 * 环境配置封装
 */
const env =
	import.meta.env.MODE || 'prod'
const envConfig = {
	dev: {
		baseApi: '/api',
		mockApi: 'https://www.fastmock.site/mock/40686df6be86cb9ab3c58f6782762add/api',
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
	namespace: 'manager',
	...envConfig[env],
}
