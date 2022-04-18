/**
 * vuex 状态管理
 */
import { createStore } from 'vuex'

import storage from '../utils/storage.js'
import mutations from './mutations'

const state = {
  userInfo: '' || storage.getItem('userInfo'),
  noticeCount: false
}
export default createStore({
  state,
  mutations
})