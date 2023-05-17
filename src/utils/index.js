import Cookies from 'js-cookie'
import store from '@/store'

/**
 * 权限
 * @param {*} key
 */
export function hasPermission (key) {
  return window.SITE_CONFIG.permissions.indexOf(key) !== -1 || false
}

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export function getDictDataList (dictType) {
  const type = window.SITE_CONFIG.dictList.find((element) => (element.dictType === dictType))
  if (type) {
    return type.dataList
  } else {
    return []
  }
}
export function getDictDateValue (val, dictType, key = 'dictValue', label = 'dictLabel') {
  const type = window.SITE_CONFIG.dictList.find((element) => (element.dictType === dictType))
  let list = []
  if (type) {
    list = type.dataList
  }
  const item = list.find(item => item[key] == val)
  if (this.$isNotNull(item)) {
    return item[label]
  }
  return val
}
export function getDictLabelByList (val, list, key = 'dictValue', label = 'dictLabel') {
  const item = list.find(item => item[key] == val)
  if (this.$isNotNull(item)) {
    return item[label]
  }
  return val
}
/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export function getDictLabel (dictType, dictValue) {
  if (dictValue === null || dictValue === undefined || dictValue === '') {
    return ''
  }
  const type = window.SITE_CONFIG.dictList.find((element) => (element.dictType === dictType))
  if (type && dictValue != null) {
    let val = ''
    if ((dictValue + '').indexOf(',') !== -1) {
      const str = dictValue.split(',')
      if (str.length > 1) {
        for (let i = 0; i < str.length; i++) {
          const lab = type.dataList.find((element) => (element.dictValue === str[i] + ''))
          if (lab !== null && lab !== undefined) {
            val += lab.dictLabel + (i < str.length - 1 ? ',' : '')
          }
        }
      }
    } else {
      const lab = type.dataList.find((element) => (element.dictValue === dictValue + ''))
      if (lab !== null && lab !== undefined) {
        val = lab.dictLabel
      }
    }
    if (val !== '') {
      return val
    } else {
      return dictValue
    }
  } else {
    return dictValue
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  store.commit('resetStore')
  Cookies.remove('token')
  window.SITE_CONFIG.dynamicMenuRoutesHasAdded = false
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList () {
  var res = []
  var list = document.querySelectorAll('svg symbol')
  for (var i = 0; i < list.length; i++) {
    res.push(list[i].id)
  }

  return res
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'pid') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]].children) {
      temp[data[k][pid]].children = []
    }
    temp[data[k][pid]].children.push(data[k])
    data[k]._level = (temp[data[k][pid]]._level || 0) + 1
  }
  return res
}

/*
    * 金额格式化：
    * number：要格式化的数字
    * decimals：保留几位小数
    * thousandsSep：千分位符号
    * tdecPoint：小数点符号
    * */
export function numberFormat (number, decimals = 2, thousandsSep = ',', tdecPoint = '.') {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  if (number.indexOf(',') > -1) {
    return number
  }
  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep
  const dec = typeof tdecPoint === 'undefined' ? '.' : tdecPoint
  let s = ''
  const toFixedFix = function (n, prec) {
    const k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
export function downloadFile (data, name) {
  const blob = new Blob([data])
  const fileName = name
  const linkNode = document.createElement('a')

  linkNode.download = fileName // a标签的download属性规定下载文件的名称
  linkNode.style.display = 'none'
  linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
  document.body.appendChild(linkNode)
  linkNode.click() // 模拟在按钮上的一次鼠标单击

  URL.revokeObjectURL(linkNode.href) // 释放URL 对象
  document.body.removeChild(linkNode)
}

// 接收参数类型yearMonthDay：2022-08-03
export function addMonths (yearMonthDay, monthNum) {
  console.log('入参', yearMonthDay, monthNum)
  monthNum = parseInt(monthNum == '' ? 0 : monthNum)
  var arr = yearMonthDay.split('-')
  var year = parseInt(arr[0])
  var month = parseInt(arr[1])
  var day = parseInt(arr[2])
  month = month + monthNum
  // month > 12 说明已经跨年，需要对年份进行修改
  if (month > 12) {
    // 确定跨年数
    // 加月份时 防止出现month=12n导致的跨年数多1，采用month-1。
    // 例如：当前日期为2020-1-1，增加23个月，实际结果是2022-12-1,跨了1年
    var yearNum = parseInt((month - 1) / 12)
    month = month % 12 == 0 ? 12 : month % 12
    year += yearNum
  } else if (month <= 0) {
    // 减月份时 防止出现month=12n导致的跨年数少1，采用month+12
    // 例如：当前日期为2020-1-1，减少1个月，实际结果是2019-12-1,跨了1年
    month = Math.abs(month)
    var yearNum = parseInt((month + 12) / 12)
    yaer -= yearNum
  }
  var maxDays = new Date(year, month, 0).getDate()
  day = day > maxDays ? maxDays : day
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day

  console.log('出参', year + '-' + month + '-' + day)
  return year + '-' + month + '-' + day
}
