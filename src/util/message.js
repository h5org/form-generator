function ElMessage (options, context) {
  context.$message?.[options?.type](options.message)
}

ElMessage.error = function(info, context) {
  context.$message.error(info)
}

export {
  ElMessage
}