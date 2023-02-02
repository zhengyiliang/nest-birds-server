const { Validator, Rule } = require('@utils/validator')

class CreateOrUpdateCategoryValidator extends Validator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '分类名必须在1~64个字符之间', {
        min: 1,
        max: 64
      })
    ]
    this.description = [
      new Rule('isLength', '分类描述必须在1~255个字符之间', {
        min: 1,
        max: 255
      })
    ]
  }
}

module.exports = {
  CreateOrUpdateCategoryValidator
}
