const { toSafeInteger, isInteger } = require('lodash')
const { ParametersException, Success } = require('@exception')
const { Op } = require('sequelize')

function success(msg, errorCode) {
  throw new Success(msg, errorCode)
}


function getSafeParamId(ctx) {
  const id = toSafeInteger(ctx.get('query.id'))
  if (!isInteger(id)) {
    throw new ParametersException({
      msg: '路由参数错误'
    })
  }
  return id
}


const findMembers = function (instance, {
  prefix,
  specifiedType,
  filter
}) {
  // 递归函数
  function _find(instance) {
    //基线条件（跳出递归）
    if (instance.__proto__ === null)
      return []

    let names = Reflect.ownKeys(instance)
    // console.log(names, 'names')
    names = names.filter((name) => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name)
    })
    return [...names, ..._find(instance.__proto__)]
  }

  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true
      }
    }
    if (prefix)
      if (value.startsWith(prefix))
        return true
    if (specifiedType)
      if (instance[value] instanceof specifiedType)
        return true
  }

  return _find(instance)
}

function byAuth(user, key = 'id') {
  // 管理员(作者)
  if (user.auth === 16) {
    return {
      [key]: user.id
    }
  }
  return {
    // auth: {
    //   [Op.lte]: auth
    // }
  }
}

async function validAuth() {

}


module.exports = {
  getSafeParamId,
  success,
  findMembers,
  byAuth
}
