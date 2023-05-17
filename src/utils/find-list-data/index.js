/**
 * 功能：
 * 根据单个属性值查找对象
 * 入参：
 * attrName:类型：string 指定的对象属性名
 * value:类型： string/number 指定的对象属性值 此处筛选不区分字符串数值与数字型数值
 * list: 类型： Array 指定需要查询的数据集合
 * 返回值：
 * return object 类型： Object

*/
export function getOneObject (attrName, value, list) {
  /* 如果list 不是一个数组则返回空对象,或者属性名不是一个字符串 */
  if (!(list instanceof Array) || typeof attrName !== 'string') {
    return {}
  }

  const obj = list.find(item => item[attrName] == value)

  return obj != null ? JSON.parse(JSON.stringify(obj)) : {}
}

/**
 * 功能：
 * 分页查询
 * 入参：
 * pageNo:类型：number 当前页
 * pageSize:类型： number 每页显示多少条
 * list: 类型： Array 指定需要分页的数据集合
 * 返回值：
 * return list 类型： Array

*/
export function paging (pageNo, pageSize, list) {
  /* console.log('pageNo',pageNo,'pageSize',pageSize); */
  pageNo = pageNo != null ? pageNo : 1
  pageSize = pageSize != null ? pageSize : list.length
  if (!(list instanceof Array) || isNaN(pageNo) || isNaN(pageSize)) {
    return []
  }
  pageNo = parseInt(pageNo)
  pageSize = parseInt(pageSize)
  pageNo = pageNo < 1 ? 1 : pageNo
  let start = ((pageNo - 1) * pageSize)
  start = start > list.length ? list.length : start
  let end = start + pageSize
  /* console.log("start+pageSize:",end) */
  end = end > list.length ? list.length : end
  /* console.log("start:",start,"end",end,"list.length",list.length); */
  const newList = []
  for (let i = start; i < end; i++) {
    newList.push(list[i])
  }
  return newList
}

/**
 * 功能：
 * 查询一个对象在这个对象集合里面的下标
 * 入参：
 * attrName:类型：string 指定在这个对象集合中能标识其身份的属性名称
 * value:类型： string/number 指定在这个对象集合中能标识其身份的属性值
 * list: 类型： Array 指定需要查找的数据集合
 * 返回值：
 * return 类型： number 对象下标

*/
export function getIndex (attrName, value, list) {
  /**
   * 如果list 不是一个数组则返回空对象,或者属性名不是一个字符串
   */
  if (!(list instanceof Array) || typeof attrName !== 'string') {
    return {}
  }

  const i = list.findIndex(item => item[attrName] == value)

  return i
}

/**
 * 功能：
 * 获取一个自增id
 * 入参：
 * attrName:类型：string 指定根据什么属性自增
 * list: 类型： Array 指定需要自增的列表
 * 返回值：
 * return 类型： number 自增id

*/
export function getMaxId (attrName, list) {
  if (!(list instanceof Array) || typeof attrName !== 'string') {
    return Date.parse(new Date())
  }
  /**
   * 处理列表为空的情况
   */
  if (list.length === 0) {
    return 1
  }
  /**
   * 处理属性不存在的问题
   */
  if (list[0][attrName] == null) {
    return Date.parse(new Date())
  }
  /**
   * 如果有不为数字的就返回list.length
   */
  const obj = list.filter(item => isNaN(item[attrName]))

  /**
   * 处理属性不是数字的情况
   */
  if (obj.length > 0) {
    return list.length > 0 ? Date.parse(new Date()) + 1 : Date.parse(new Date())
  } else {
    // 处理属性值为数字的情况
    list = list.sort((a, b) => {
      if (a[attrName] == null) {
        a[attrName] = 0
      }
      if (b[attrName] == null) {
        b[attrName] = 0
      }
      return parseInt(b[attrName]) - parseInt(a[attrName])
    })
    return parseInt(list[0][attrName]) + 1
  }
}

/**
 * 功能
 * 根据条件查询
 * 传入参数
 * attrArray:类型：Array 为需要查询的属性列表
 * item: 类型： Object 指定查询的值
 * list: 类型： Array 指定需要查询的列表
 * return 类型： Array 返回根据条件筛选后的数据
 * type 类型： number --整数。外部调用该方法请传入0
 * 0：从请求传入
 * 1：内部递归传入
 * 返回值：
 * list: 类型：Array
*/
export function queryWithObject (attrArray, item, list, type) {
  if (attrArray.length <= 0) {
    return list
  }
  /**
   * 如果item[attrArray[attr]]的值为null或者为'' 就清除一个这个查询条件
   */
  if (type === 0) {
    attrArray = attrArray.filter(attr => item[attr] != null && item[attr] !== '')
  }
  /**
   * 筛选符合条件的数据
   */
  list = list.filter(data => item[attrArray[0]] == data[attrArray[0]])

  /**
   * 清除已经筛选过的条件
   */
  attrArray.splice(0, 1)
  /**
   * 递归
   */
  queryWithObject(attrArray, item, list, 1)

  return list
}
