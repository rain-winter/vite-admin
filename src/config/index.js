/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const envConfig = {
  dev: {
    baseApi: 'http://localhost:8083/',
    mockApi:
      'https://www.fastmock.site/mock/40686df6be86cb9ab3c58f6782762add/api',
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/',
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/',
  },
}
export default {
  env: env,
  mock: true,
  namespace: 'manager',
  ...envConfig[env],
}
