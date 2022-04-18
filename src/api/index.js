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
  noticeCount () {
    return request({
      method: 'get',
      url: '/leave/count',
    })
  },
  getMenuList () {
    return request({
      method: 'get',
      url: '/menu/list',
    })
  }
}