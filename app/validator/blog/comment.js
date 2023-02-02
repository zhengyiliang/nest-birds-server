const { Rule } = require('@validator')
const { PositiveIntegerValidator } = require('@validator/common')

class CreateCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.nickname = [
      new Rule('isLength', '昵称必须在1~32个字符之间', {
        min: 1,
        max: 32
      })
    ],
      this.content = [
        new Rule('isLength', '内容必须在1~1023个字符之间', {
          min: 1,
          max: 1023
        })
      ]
    this.email = [
      new Rule('isOptional'),
      new Rule('isEmail', '不符合Email规范')
    ]
    this.website = [
      new Rule('isOptional'),
      new Rule('isURL', '不符合URL规范')
    ]
  }
}

class ReplyCommentValidator extends CreateCommentValidator {
  constructor() {
    super()
    this.parentId = [
      new Rule('isInt', '需要是正整数', {
        min: 1
      })
    ]
  }
}


module.exports = {
  CreateCommentValidator,
  ReplyCommentValidator,
}