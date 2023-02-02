const router = require('express').Router()

const { PositiveIntegerValidator, PaginateValidator } = require('@validator/common')
const { success } = require('@utils/util')
const { Auth } = require('@middleware/auth')
const { MessageDao } = require('@dao/blog/message')

const MessageDto = new MessageDao()

// path => /blog/message/list 获取所有留言
router.get('/list', new Auth().m, async (req) => {
  const v = await new PaginateValidator().validate(req)
  const { rows, total } = await MessageDto.getMessages(v)
  success('获取留言成功', {
    list: rows,
    total,
  })
})

// path => /blog/message/create 删除留言，需要最高权限才能删除留言
router.delete('/delete', new Auth(32).m, async (req) => {
  const v = await new PositiveIntegerValidator().validate(req)
  const id = v.get('query.id')
  await MessageDto.deleteMessage(id)
  success('删除留言成功')
})

module.exports = router
