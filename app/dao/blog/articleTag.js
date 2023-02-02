const { Op } = require('sequelize')

const { BlogTag, BlogArticleTag } = require('@models')

class ArticleTagDao {
  async create(articleId, tags, options = {}) {
    // console.log(tags, articleId)
    const arr = typeof tags === 'string' ? JSON.parse(tags) : tags
    for (let i = 0; i < arr.length; i++) {
      await BlogArticleTag.create({
        article_id: articleId,
        tag_id: arr[i],
      }, { ...options })

    }
  }

  // async getArticleTag(articleId) {
  //   const result = await BlogArticleTag.findAll({
  //     where: {
  //       article_id: articleId
  //     }
  //   })
  //   let ids = result.map(v => v.tag_id)
  //   return await BlogTag.findAll({
  //     where: {
  //       id: {
  //         [Op.in]: ids
  //       }
  //     }
  //   })
  // }

  async getArticleIds(tagIds) {
    const result = await BlogArticleTag.findAll({
      where: {
        tag_id: {
          [Op.in]: tagIds
        }
      }
    })
    return result.map(v => v.article_id)
  }

  async deleteArticleTag(articleId, tags = []) {
    const result = await BlogArticleTag.findAll({
      where: {
        article_id: articleId
      }
    })
    // 如果 id 相同则不再需要删除
    if (tags.length && result.map(v => v.tag_id).join('') === tags.join('')) {
      return false
    } else {
      for (let i = 0; i < result.length; i++) {
        await result[i].destroy()
      }
      return true
    }
  }
}

module.exports = {
  ArticleTagDao
}