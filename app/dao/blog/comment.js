const { NotFound } = require('@exception')
const { BlogComment, BlogArticle, SysWebUser } = require('@models')

class CommentDao {
  // 创建对应文章的评论
  async create(v, articleId) {
    const userId = v.get('body.userId')
    const article = await BlogArticle.findByPk(articleId)
    if (!article) {
      throw new NotFound('没有找到相关文章')
    }
    const user = await SysWebUser.findByPk(userId)
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    return await BlogComment.create({
      web_user_id: userId,
      content: v.get('body.content'),
    })
  }

  // 根据文章id获取相关评论
  async get(articleId) {
    let comments = await BlogComment.findAll({
      where: {
        article_id: articleId
      },
      order: [
        ['created_at', 'DESC']
      ],
      attributes: { exclude: ['article_id', 'ArticleId'] }
    })
    comments.forEach(v => {
      v.setDataValue('created_date', v.created_at)
    })
    return comments
  }

  // 删除评论
  async delete(id) {
    const comment = await BlogComment.findOne({
      where: {
        id
      }
    })
    if (!comment) {
      throw new NotFound('没有找到相关评论')
    }
    comment.destroy()
  }

  // 点赞评论
  // async like(id) {
  //   const comment = await BlogComment.findByPk(id)
  //   if (!comment) {
  //     throw new NotFound({
  //       msg: '没有找到相关评论'
  //     })
  //   }
  //   await comment.increment('like', { by: 1 })
  // }

  // 回复评论
  async reply(v, articleId, parentId) {
    const article = await BlogArticle.findByPk(articleId)
    if (!article) {
      throw new NotFound('没有找到相关文章')
    }
    const comment = await BlogComment.findByPk(parentId)
    if (!comment) {
      throw new NotFound('没有找到相关评论')
    }
    return await BlogComment.create({
      parent_id: parentId,
      article_id: articleId,
      // nickname: v.get('body.nickname'),
      web_user_id: v.get('body.userId'),
      content: v.get('body.content'),
    })
  }
}

module.exports = {
  CommentDao
}