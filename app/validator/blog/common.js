const { Validator, Rule } = require('@utils/validator')
const config = require('@config')

class PositiveIntegerValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要是正整数', {
        min: 1
      })
    ]
  }
}

class PaginateValidator extends Validator {
  constructor() {
    super()
    this.page = [
      new Rule('isOptional', '', config.paginate.pageDefault),
      new Rule('isInt', 'page必须为整数，且大于等于0', {
        min: 0
      })
    ]
    this.pageSize = [
      new Rule('isOptional', '', config.paginate.countDefault),
      new Rule('isInt', 'count必须为正整数', {
        min: 1
      })
    ]
  }
}

class NotEmptyValidator extends Validator {
  constructor() {
    super()
    this.token = [
      new Rule('isLength', '不允许为空', {
        min: 1
      })
    ]
  }
}


module.exports = {
  PositiveIntegerValidator,
  PaginateValidator,
  NotEmptyValidator
}