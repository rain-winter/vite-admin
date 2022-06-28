/**
 * vuex 状态管理
 */
import { createStore } from 'vuex'

import storage from '../utils/storage.js'
import mutations from './mutations'

const state = {
  userInfo: '' || storage.getItem('userInfo'),
  noticeCount: false,
  menuList:storage.getItem('menuList') || [],
  actionList:storage.getItem('actionList')
}

export default createStore({
  state,
  mutations
})