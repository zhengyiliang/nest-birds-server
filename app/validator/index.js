const { Validator, Rule } = require('@utils/validator')

// 登录request字段校验
class LoginValidator extends Validator {
  constructor() {
    super()
    this.name = new Rule('isNotEmpty', '名称不可为空');
    this.password = new Rule('isNotEmpty', '密码不可为空');
  }
}

module.exports = {
  LoginValidator
}