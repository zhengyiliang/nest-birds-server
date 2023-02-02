const router = require('express').Router
const { PositiveIntegerValidator } = require('@validator/common')
const { CreateCommentValidator, ReplyCommentValidator } = require('@validator/blog/comment')
const { CommentDao } = require('@dao/blog/comment')
const CommentDto = new CommentDao()


// path => /blog/comment/add   添加评论
router.post('/add', async (req) => {
  const v = await new CreateCommentValidator().validate(req, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  await CommentDto.create(v, articleId)
  success('添加评论成功')
})

// path => /blog/comment/get 获取文章下的全部评论
router.get('/get', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('query.articleId')
  const comments = await CommentDto.getComments(articleId)
  ctx.body = comments
})

// path => /blog/comment/like 点赞某条评论
// router.put('/like', async (ctx) => {
//   const v = await new PositiveIntegerValidator().validate(ctx)
//   const id = v.get('body.id')
//   await CommentDto.like(id)
//   success('点赞评论成功')
// })

// path => /blog/comment/reply 回复某条评论
router.post('/reply', async (ctx) => {
  const v = await new ReplyCommentValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  const parentId = v.get('body.parentId')
  await CommentDto.reply(v, articleId, parentId)
  success('回复成功')
})

module.exports = router