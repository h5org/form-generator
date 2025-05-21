function getTimeColumnsType(format) {
  if (!format) return []
  
  const columns = []
  
  format.includes('HH') && columns.push('hour')
  format.includes('mm') && columns.push('minute')
  format.includes('ss') && columns.push('second')
  
  return columns
}

function formatTimeValue(values, format) {
  let result = format
  let valueIndex = 0

  // 替换小时
  if (format.includes('HH')){
    result = result.replaceAll('HH', values[valueIndex] || '00')
    valueIndex++
  }
  // 替换分钟
  if (format.includes('mm')){
    result = result.replaceAll('mm', values[valueIndex] || '00')
    valueIndex++
  }
  // 替换秒
  if (format.includes('ss')){
    result = result.replaceAll('ss', values[valueIndex] || '00')
    valueIndex++
  }
  
  return result
}

function parseTimeToArray(timeString, format) {
  const values = []

  // 解析小时
  if (format.includes('HH')){
    const hourIndex = format.indexOf('HH')
    values.push(timeString.substring(hourIndex, hourIndex + 2))
  }
  // 解析分钟
  if (format.includes('mm')){
    const minuteIndex = format.indexOf('mm')
    values.push(timeString.substring(minuteIndex, minuteIndex + 2))
  }
  // 解析秒
  if (format.includes('ss')){
    const secondIndex = format.indexOf('ss')
    values.push(timeString.substring(secondIndex, secondIndex + 2))
  }
  
  return values
}

export {
  getTimeColumnsType,
  formatTimeValue,
  parseTimeToArray
}