/**
 * storage二次封装
 * @time 2022.4.2
 * @author rain
 */

import config from '../config'

export default {
  setItem(key, val) {
    // let obj = { [key]: val } // 当key是变量时，必须使用[]包括才能正确写入。不用【】会当成字符串
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(key))
  },
  getItem(key) {
    return this.getStorage()[key]
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
  },
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
  },
}
