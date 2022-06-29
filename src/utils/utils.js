/**
 * 工具函数封装
 */
export default {
  generateRoute(menulist) {
    // 动态生成路由
    let routes = []
    const deepList = list => {
      while (list.length) {
        let item = list.pop()
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          })
        }
        if (item.children && !item.action) {
          deepList(item.children)
        }
      }
    }
    deepList(menulist)
    // console.log('routes=>', routes)
    return routes
  },
  formateDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    // 匹配四位年
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }

    const o = {
      'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    }

    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + ''
        fmt = fmt.replace(RegExp.$1, val)
      }
    }
    return fmt
  },
}
