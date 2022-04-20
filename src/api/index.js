/**
 * aoi 管理
 */
import request from '../utils/request'

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
  }
}