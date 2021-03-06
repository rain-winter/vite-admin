/**
 * api 管理
 */
import request from '../utils/request'

export default {
  login(params) {
    return request({
      method: 'post',
      url: '/users/login',
      data: params,
    })
  },
  // 首页消息
  noticeCount() {
    return request({
      method: 'get',
      url: '/leave/count',
      data: {},
      mock: true,
    })
  },
  // 获取菜单列表
  getMenuList(params) {
    return request({
      method: 'get',
      url: '/menu/list',
      data: params,
    })
  },
  getUserList(params) {
    // 获取用户列表，带分页
    return request({
      method: 'get',
      url: '/users/list',
      data: params,
    })
  },
  getAllUserList() {
    // 获取全部用户
    return request({
      method: 'get',
      url: '/users/all/list',
    })
  },
  userDel(params) {
    return request({
      method: 'post',
      url: '/users/delete',
      data: params,
    })
  },
  // 查询所有角色列表
  getRoleAllList() {
    return request({
      method: 'get',
      url: '/roles/allList',
    })
  },
  // 按列获取角色列表
  getRoleList(params) {
    return request({
      method: 'get',
      url: '/roles/list',
      data: params,
    })
  },
  // 获取部门列表
  getDeptList(params) {
    return request({
      url: '/dept/list',
      method: 'get',
      data: params,
    })
  },
  // 用户的CRUD
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
    })
  },
  // 部门的添加、更新、删除
  deptOperate(params) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data: params,
    })
  },
  getPermissionList() {
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      mock: false,
    })
  },
  // 角色的 添加、修改、删除
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
    })
  },

  // 更新权限
  updatePermission(params) {
    return request({
      url: '/roles/updatePermission',
      method: 'post',
      data: params,
    })
  },
  // 休假申请列表
  getLeaveList(params) {
    return request({
      url: '/leave/list',
      method: 'get',
      data: params,
      mock: true,
    })
  },

  // 处理休假申请
  leaveOperate(params) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params,
      mock: true,
    })
  },
}
