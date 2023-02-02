function isThisType(val) {
  for (let key in this) {
    if (this[key]?.toString() === val?.toString()) {
      return true
    }
  }
  return false
}

const Type = {
  YES: 1,
  NOT: 0,
  isThisType
}

// 账号状态
const StatusType = {
  ACTIVE: 0, // 启用
  STOP: 1, // 停用
  isThisType
}

const AuthType = {
  USER: 8,
  ADMIN: 16,
  SUPER_ADMIN: 32,
  isThisType
}

const TokenType = {
  ACCESS: 'access',
  REFRESH: 'refresh'
}


module.exports = {
  AuthType,
  TokenType,
  StatusType,
  Type
}
