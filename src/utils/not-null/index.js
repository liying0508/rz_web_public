// 判断是否为空
export default (val) => {
  if (val instanceof Array) {
    return val != null && val !== undefined && val.length > 0;
  }
  return val !== null && val !== undefined && val !== '';
}
