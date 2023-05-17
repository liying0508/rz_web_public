import $isNotNull from '@/utils/not-null'
export default (time, format) => {
  if (!$isNotNull(time)) {
    return ''
  }
  if (!$isNotNull(format)) {
    return time
  }
  let date = new Date()
  if ($isNotNull(time)) {
    date = new Date(time)
  }

  const year = date.getFullYear()
  const day = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'][date.getDate()]
  const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'][date.getMonth()]
  const hour = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
  const m = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
  const s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`
  } else if (format === 'YYYY-MM') {
    return `${year}-${month}`
  } else if (format === 'YYYY') {
    return `${year}`
  } else if (format === 'YYYY-MM-DD HH') {
    return `${year}-${month}-${day} ${hour}`
  } else if (format === 'YYYY-MM-DD HH:mm') {
    return `${year}-${month}-${day} ${hour}:${m}`
  } else if (format === 'YYYY-MM-DD HH:mm:ss') {
    return `${year}-${month}-${day} ${hour}:${m}:${s}`
  } else {
    return time
  }
}
