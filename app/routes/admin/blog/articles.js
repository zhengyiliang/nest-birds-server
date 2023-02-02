var router = require('express').Router()
const { PositiveIntegerValidator, PaginateValidator } = require('@validator/common')
const {
    CreateOrUpdateArticleValidator,
    // GetArticlesValidator,
    // SetPublicValidator,
    // SetStarValidator
} = require('@validator/blog/article')
const { success } = require('@utils/util')
const { Auth } = require('@middleware/auth')
const UpLoader = require('@utils/upload')

const { ArticleDao } = require('@dao/blog/article')
// const { CommentDao } = require('@dao/blog/comment')
const { Validator } = require('@utils/validator')
const { FileUploadException } = require('@utils/http-exception')

const ArticleDto = new ArticleDao()
// const CommentDto = new CommentDao()

// path => /blog/article/create 创建文章
router.post('/create', new Auth().m, async (req) => {
    const v = await new CreateOrUpdateArticleValidator().validate(req)
    const currentUser = req.currentUser

    await ArticleDto.create(v, currentUser)
    success('新建文章成功')
})

// // path => /blog/article/update 更新文章
router.put('/update', new Auth().m, async (req) => {
    await new PositiveIntegerValidator().validate(req)
    const v = await new CreateOrUpdateArticleValidator().validate(req)

    await ArticleDto.update(v)
    success('更新文章成功')
})

// path => /blog/article/detail 获取文章详情 -> 修改文章之前先获取文章详情
router.get('/detail', new Auth().m, async (req) => {
    const v = await new PositiveIntegerValidator().validate(req)
    const article = await ArticleDto.getDetailById(v.get('query.id'))
    success('获取文章详情成功', article)
})

router.get('/content', new Auth().m, async (req) => {
    const v = await new PositiveIntegerValidator().validate(req)
    const content = await ArticleDto.getContentById(v.get('query.id'))
    success('获取成功', content)
})

// path => /blog/article/list 管理后台 获取全部文章
router.post('/list', new Auth().m, async (req) => {
    const v = await new PaginateValidator().validate(req)
    const result = await ArticleDto.getList(v, req.currentUser)
    success('获取文章列表成功', result)
})

// path => /blog/article/delete 删除某篇文章，需要最高权限
router.delete('/delete', new Auth(32).m, async (req) => {
    const v = await new PositiveIntegerValidator().validate(req)
    const id = v.get('query.id')
    await ArticleDto.delete(id)
    success('删除文章成功')
})

// // path => /blog/article/public/update 设置某篇文章为 公开 或 私密
// router.put('/public/update', new Auth().m, async (req) => {
//     const v = await new SetPublicValidator().validate(req)
//     const id = v.get('query.id')
//     const publicId = v.get('body.publicId')
//     await ArticleDto.updatePublic(id, publicId)
//     success(`设为${publicId === 1 ? '公开' : '私密'}成功`)
// })

// // path => /blog/article/isTop/update 设置某篇文章为 精选 或 非精选
// router.put('/isTop/update', new Auth().m, async (req) => {
//     const v = await new SetStarValidator().validate(req)
//     const id = v.get('query.id')
//     const starId = v.get('body.starId')

//     await ArticleDto.updateStar(id, starId)
//     success(`设为${starId === 2 ? '精选' : '非精选'}成功`)
// })

// path => /blog/article/comment/list 获取文章下的全部评论
// router.get('/comment/list', new Auth().m, async (req) => {
//     const v = await new PositiveIntegerValidator().validate(req, {
//         id: 'articleId'
//     })
//     const articleId = v.get('query.articleId')
//     const comments = await CommentDto.getComments(articleId)
//     success('获取文章评论成功', comments)
// })

// // path => /blog/article/comment/delete 删除某条评论 需要最高权限
// router.delete('/comment/delete', new Auth(32).m, async (req) => {
//     const v = await new PositiveIntegerValidator().validate(req)
//     const id = v.get('query.id')
//     await CommentDto.deleteComment(id)
//     success('删除评论成功')
// })

// path => /blog/article/cover/upload
router.post('/cover/upload', new Auth().m, UpLoader.m('cover', '/blog/cover'), async (req, res) => {
    if (req.file) {
        success('上传成功', req.file.url)
    } else {
        throw new FileUploadException('上传失败')
    }
})

// path => /blog/article/image/upload
router.post('/image/upload', new Auth().m, UpLoader.m('file', '/blog/images'), async (req, res) => {
    if (req.file) {
        success('图片上传成功', req.file.url)
    } else {
        throw new FileUploadException('图片上传失败')
    }
})

// path => /blog/article/cover/delete
router.delete('/cover/delete', new Auth().m, async (req) => {
    const v = await new Validator().validate(req)
    const upLoader = new UpLoader()
    await upLoader.delete(v.get('query.filename'))
})

module.exports = router