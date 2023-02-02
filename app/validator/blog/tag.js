const { Validator, Rule } = require('@utils/validator')

class CreateOrUpdateTagValidator extends Validator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '标签名必须在1~64个字符之间', {
        min: 1,
        max: 64
      })
    ]
  }
}

module.exports = {
  CreateOrUpdateTagValidator
}
