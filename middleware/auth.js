const jwt = require('jsonwebtoken')
const { SysUser } = require('@models')
const { TokenType } = require('@utils/enums')
const config = require('@config')

const { Forbidden, AuthFailed, NotFound, InvalidToken, ExpiredToken, RefreshException } = require('@exception')

/**
 * 解析请求头
 * @param request request 请求参数
 * @param type 令牌的类型
 */
async function parseHeader(request, type = TokenType.ACCESS) {
  // console.log(request.header)
  if (!request.header('authorization')) {
    throw new AuthFailed("认证失败，请检查请求令牌是否正确")
  }
  const parts = request.header('authorization').split(' ')
  if (parts.length === 2) {
    // Bearer 字段
    const schema = parts[0]
    // token 字段
    const token = parts[1]
    if (/^Bearer$/i.test(schema)) {
      let decode
      try {
        decode = jwt.verify(token, config.security.secretKey)
      } catch (error) {
        // 需要重新刷新令牌
        if (error.name === 'TokenExpiredError') {
          throw new ExpiredToken("认证失败，token已过期")
        } else {
          throw new InvalidToken("认证失败，令牌失效")
        }
      }

      if (!decode.type || decode.type !== type) {
        throw new AuthFailed('请使用正确类型的令牌')
      }

      if (!decode.scope || decode.scope < request.level) {
        throw new Forbidden('权限不足')
      }

      const user = await SysUser.findByPk(decode.uid)
      if (!user) {
        throw new NotFound('没有找到相关用户')
      }

      // 把 user 挂在 ctx 上
      request.currentUser = user

      // 往令牌中保存数据
      request.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
    } else {
      throw new AuthFailed()
    }
  } else {
    throw new AuthFailed()
  }
}

/**
 * 生成令牌
 * @param {number} uid
 * @param {number} scope
 * @param {TokenType} type 
 * @param {Object} options 
 */
const generateToken = function (user, type = TokenType.ACCESS, options) {
  const secretKey = config.security.secretKey
  const token = jwt.sign({
    uid: user.id,
    scope: user.auth,
    name: user.name,
    avatar: user.avatar,
    type
  }, secretKey, {
    expiresIn: options.expiresIn
  })
  return token
}

/**
 * 守卫函数，用户登陆即可访问
 */
const loginRequired = async function (request, next) {
  if (request.method !== 'OPTIONS') {
    await parseHeader(request, TokenType.ACCESS)
    await next()
  } else {
    await next()
  }
}

/**
 * 守卫函数，用户刷新令牌，统一异常
 */
const refreshTokenRequiredWithUnifyException = async function (request, next) {
  if (request.method !== 'OPTIONS') {
    try {
      await parseHeader(request, TokenType.REFRESH)
    } catch (e) {
      throw new RefreshException()
    }
    await next()
  } else {
    await next()
  }
}

class Auth {
  constructor(level) {
    this.level = level || 1
  }

  get m() {
    return async (request, _, next) => {
      request.level = this.level
      return await loginRequired(request, next)
    }
  }
}

class RefreshAuth {
  constructor(level) {
    this.level = level || 1
  }

  get m() {
    return async (request, _, next) => {
      request.level = this.level
      return await refreshTokenRequiredWithUnifyException(request, next)
    }
  }
}


module.exports = {
  Auth,
  RefreshAuth,
  generateToken
}
