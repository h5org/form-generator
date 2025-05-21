export const isExpression = (str) => {
  // 使用正则表达式判断是否符合 {{ 表达式 }} 模式
  const regex = /^\s*{{[\s\S]*?}}\s*$/
  return regex.test(str)
}

export const extractExpression = (str) => {
  const regex = /^\s*{{([\s\S]*?)}}\s*$/
  const match = regex.exec(str)
  if (match) {
    return match[1]
  } else {
    return ''
  }
}

export const executeExpression = (str, args, context) => {
  try{
    if (context) {
      return (Function('args', `return ${str}`).bind(context))(args)
    } else {
      return (Function('args', `return ${str}`))(args)
    }
  } catch (e) {
    return null
  }
}

