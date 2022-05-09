import {
  ElMessage
} from 'element-plus'

// 弹框提示
export default {
  success(message) {
    ElMessage({
      message,
      type: 'success',
    })
  },
  error(message) {
    ElMessage.error(message)
  }
}