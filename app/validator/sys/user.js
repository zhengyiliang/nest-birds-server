const { Validator, Rule } = require('@utils/validator')
const { AuthType, StatusType } = require('@utils/enums')

// 检查权限参数合法性
function checkAuth(val) {
  let auth = val.body.auth
  if (!auth) {
    throw new Error('auth是必须参数')
  }
  auth = parseInt(auth)
  if (!AuthType.isThisType(auth)) {
    throw new Error('auth参数不合法')
  }
}


// 检查账号状态参数合法性
function checkStatus(val) {
  let status = val.body.status || StatusType.ACTIVE
  status = parseInt(status)
  if (!StatusType.isThisType(status)) {
    throw new Error('status参数不合法')
  }
}

// 修改用户信息
class UpdateUserValidator extends Validator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    // this.avatar = [
    //   new Rule('isURL', '不符合URL规范')
    // ]
    this.description = [
      new Rule('isLength', '描述长度为1~255个字符', {
        min: 1,
        max: 255
      })
    ]
    this.validateAuth = checkAuth
    this.validateStatus = checkStatus
  }
}

// 创建用户字段校验
class CreateUserValidator extends UpdateUserValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '用户名长度为4~32个字符', {
        min: 4,
        max: 32
      })
    ]
    // this.password = [
    //   new Rule('isLength', '密码长度为6~32个字符', {
    //     min: 6,
    //     max: 32
    //   }),
    //   new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    // ]
  }
}

class getUsersValidator extends Validator {
  constructor() {
    super()
    this.current = [new Rule('isNotEmpty', '缺失current字段')]
    this.pageSize = [new Rule('isNotEmpty', '缺失pageSize字段')]
  }
}

class UpdateUserPasswordValidator extends Validator {
  constructor() {
    super()
    this.oldPassword = [
      new Rule('isLength', '密码长度为6~32个字符', {
        min: 6,
        max: 32
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    this.newPassword = [
      new Rule('isLength', '密码长度为6~32个字符', {
        min: 6,
        max: 32
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
  }
}

class UpdateAuthValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要正整数', {
        min: 1
      })
    ]
    this.validateAuth = checkAuth
  }
}

class UpdateStatusValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要正整数', {
        min: 1
      })
    ]
    this.validateStatus = checkStatus
  }
}

// class PasswordValidator extends Validator {
//   constructor() {
//     super()
//     this.password = [
//       new Rule('isLength', '密码长度为6~32个字符', {
//         min: 6,
//         max: 32
//       }),
//       new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
//     ]
//   }
// }

// class SelfPasswordValidator extends PasswordValidator {
//   constructor() {
//     super()
//     this.oldPassword = [
//       new Rule('isLength', '密码长度为6~32个字符', {
//         min: 6,
//         max: 32
//       }),
//       new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
//     ]
//   }
// }

// class AvatarUpdateValidator extends Validator {
//   constructor() {
//     super()
//     this.avatar = new Rule('isNotEmpty', '必须传入头像的url链接');
//   }
// }

module.exports = {
  // SelfPasswordValidator,
  CreateUserValidator,
  UpdateUserValidator,
  getUsersValidator,
  UpdateUserPasswordValidator,
  UpdateAuthValidator,
  UpdateStatusValidator
  // PasswordValidator,
  // AvatarUpdateValidator
}