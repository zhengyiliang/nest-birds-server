const { sequelize } = require('@models')
const { omitBy, isUndefined, intersection, unset } = require('lodash')
const { Op } = require('sequelize')

const { NotFound, Forbidden } = require('@exception')
const { BlogArticle, BlogTag, SysUser, BlogComment, BlogCategory } = require('@models')
const { ArticleTagDao } = require('@dao/blog/articleTag')
const { CategoryDao } = require('@dao/blog/category')
const { TagDao } = require('@dao/blog/tag')
const { Type } = require('@utils/enums')
const { byAuth } = require('@utils/util')
const paginate = require('@config').paginate
const ArticleTagDto = new ArticleTagDao()
const CategoryDto = new CategoryDao()
const TagDto = new TagDao()

class ArticleDao {
  // 创建文章
  async create(v, user) {
    const article = await BlogArticle.findOne({
      where: {
        title: v.get('body.title'),
        ...byAuth(user, 'user_id')
      }
    })
    if (article) {
      throw new Forbidden('存在同名文章')
    }
    const categoryId = v.get('body.categoryId')
    const tagIds = v.get('body.tags')
    const category = await CategoryDto.getById(categoryId)
    // 过滤不存在的标签
    let tags = await TagDto.getByIds(tagIds)
    tags = JSON.parse(JSON.stringify(tags)).map(x => x.id)
    if (!category) {
      throw new Forbidden('未能找到相关分类')
    }
    if (!tags?.length) {
      throw new Forbidden('未能找到相关标签')
    }
    return sequelize.transaction(async t => {
      const result = await BlogArticle.create({
        title: v.get('body.title'),
        content: v.get('body.content'),
        description: v.get('body.description'),
        cover: v.get('body.cover'),
        category_id: categoryId,
        public: v.get('body.isPublic'),
        status: v.get('body.status'),
        isTop: v.get('body.isTop'),
        isHot: v.get('body.isHot'),
        user_id: user.id
      }, { transaction: t })
      const articleId = result.getDataValue('id')

      await ArticleTagDto.create(articleId, tags, { transaction: t })
    })
  }

  // // 编辑某篇文章
  async update(v) {
    const id = v.get('body.id')
    const article = await BlogArticle.findByPk(id)
    if (!article) {
      throw new NotFound('没有找到相关文章')
    }
    const tags = v.get('body.tags')

    // step1: 先删除相关关联
    const isDeleteTag = await ArticleTagDto.deleteArticleTag(id, tags)

    if (isDeleteTag) {
      await ArticleTagDto.create(id, tags)
    }


    // step3: 更新文章
    article.title = v.get('body.title')
    article.content = v.get('body.content')
    article.description = v.get('body.description')
    article.cover = v.get('body.cover')
    article.category_id = v.get('body.categoryId')
    article.public = v.get('body.isPublic')
    article.status = v.get('body.status')
    article.isTop = v.get('body.isTop')
    article.isHot = v.get('body.isHot')
    article.save()
  }

  // 获取文章详情
  async getDetailById(id) {
    const article = await BlogArticle.scope('bh').findOne({
      where: {
        id
      },
      include: [
        {
          model: BlogTag,
          as: 'tags',
          attributes: ['id'],
          // through: 'BlogArticleTag'
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: ['user_id']
      },
      // raw: true

    })
    // console.log(article)
    if (!article) {
      throw new NotFound('没有找到相关文章')
    }
    const obj = JSON.parse(JSON.stringify(article))

    const { isHot, public: isPublic, isTop, status, category_id, tags, ...args } = obj

    return {
      isHot: isHot.toString(),
      isPublic: isPublic.toString(),
      isTop: isTop.toString(),
      categoryId: category_id,
      status: status.toString(),
      tags: tags.map(x => x.id),
      ...args
    }
  }

  async getContentById(id) {
    const article = await BlogArticle.findOne({
      where: {
        id
      },
      include: [
        {
          model: SysUser,
          attributes: ['id', 'name', 'avatar'],
          as: 'user',
        },
      ],
      attributes: ['updated_at', 'content', 'status']
    })
    if (!article) {
      throw new NotFound('没有找到相关文章')
    }
    return article
  }

  // 获取文章列表


  // async like(id) {
  //   const article = await BlogArticle.findByPk(id)
  //   if (!article) {
  //     throw new NotFound({
  //       msg: '没有找到相关文章'
  //     })
  //   }
  //   await article.increment('like', { by: 1 })
  // }

  // // 把文章设为私密或公开
  // async updatePublic(id, publicId) {
  //   const article = await BlogArticle.findByPk(id)
  //   if (!article) {
  //     throw new NotFound({
  //       msg: '没有找到相关文章'
  //     })
  //   }
  //   article.public = publicId
  //   article.save()
  // }

  // // 把文章设为置顶(1)或非置顶(0)
  // async updateIsTop(id, isTop) {
  //   if (isTop === 1) {
  //     const articles = await BlogArticle.findAll({
  //       attributes: ['id']
  //     })
  //     if (articles.length === 10) {
  //       throw new Forbidden({
  //         msg: '最多只能设置10篇置顶文章'
  //       })
  //     }
  //   }
  //   const article = await BlogArticle.findByPk(id)
  //   if (!article) {
  //     throw new NotFound({
  //       msg: '没有找到相关文章'
  //     })
  //   }
  //   article.isTop = isTop
  //   article.save()
  // }

  // // 获取所有精选文章
  // // async getListByStar() {
  // //   const articles = await BlogArticle.scope('frontShow').findAll({
  // //     where: {
  // //       isTop: 2,      // 精选
  // //     },
  // //     include: [
  // //       {
  // //         model: SysUser,
  // //         as: 'users',
  // //         attributes: ['id', 'name']
  // //       },
  // //       {
  // //         model: BlogCategory,
  // //         as: 'category',
  // //         attributes: ['id', 'name', 'cover']
  // //       }
  // //     ],
  // //     attributes: ['id', 'title', 'cover', 'created_at'],
  // //   })
  // //   return articles
  // // }

  // 获取历史归档
  // async getArchive() {
  //   const articles = await BlogArticle.scope('frontShow').findAll({
  //     order: [
  //       ['created_at', 'DESC']
  //     ],
  //     include: [
  //       {
  //         model: SysUser,
  //         as: 'users',
  //         attributes: ['id', 'name', 'avatar']
  //       }
  //     ],
  //     attributes: ['id', 'title', 'created_at']
  //   })
  //   return articles
  // }

  /**
   * 获取所有文章
   * @param {Object} v 操作对象
   * @param {Boolean} isWeb 是否展示端
   */
  async getList(v, currentUser, isWeb = false) {
    const tagIds = v.get('body.tagIds')
    const keyword = v.get('body.keyword')
    const userId = v.get('body.userId')
    const isHot = v.get('body.isHot')
    const isTop = v.get('body.isTop')
    const status = v.get('body.status')
    const isPublic = v.get('body.isPublic')
    const categoryId = v.get('body.categoryId')
    const page = v.get('body.page') || paginate.pageDefault
    const pageSize = v.get('body.pageSize') || paginate.pageSizeDefault

    let where = {

    }

    // 根据 tagId 查询文章
    let articleIds = []
    if (tagIds?.length) {
      articleIds = await ArticleTagDto.getArticleIds(tagIds)
    }
    // 如果
    if (articleIds.length) {
      where.id = {
        [Op.in]: articleIds
      }
    }

    if (keyword) {
      where.title = {
        [Op.like]: `%${keyword}%`,
      }
    }

    if (userId) {
      where.user_id = userId
    }
    if (categoryId) {
      where.category_id = categoryId
    }
    if (Type.isThisType(isHot)) {
      where.isHot = isHot
    }
    if (Type.isThisType(isTop)) {
      where.isTop = isTop
    }
    if (Type.isThisType(status)) {
      where.status = status
    }
    if (Type.isThisType(isPublic)) {
      where.public = isPublic
    }

    const { rows, count } = await BlogArticle.findAndCountAll({
      where,
      distinct: true,
      offset: (page - 1 > 0 ? page - 1 : 0) * pageSize,
      limit: pageSize,
      order: [
        ['created_at', 'DESC']
      ],
      include: [
        {
          model: BlogTag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: {
            attributes: []
          }
        },
        {
          model: BlogCategory,
          attributes: ['id', 'name'],
          as: 'category',
        },
        {
          model: SysUser,
          attributes: ['id', 'name'],
          as: 'user',
          where: {
            ...byAuth(currentUser)
          }
        },
        {
          model: BlogComment,
          as: 'comments',
          attributes: ['id'],
          // where: {
          //   is_read: 0
          // }
        },
      ],
      attributes: {
        // exclude: isWeb
        //   ? ['content', 'public', 'status']
        //   : ['content']

        exclude: ['content', 'deleted_at', 'category_id', 'user_id']
      },
    })

    // const articles = JSON.parse(JSON.stringify(rows))
    // articles.forEach(v => {
    //   v.comment_count = v.comments.length
    //   unset(v, 'category_id')
    //   unset(v, 'comments')
    // })

    return {
      list: rows,
      total: count
    }
  }

  // // 前端展示搜索文章
  // // async searchArticles(v) {
  // //   const search = v.get('query.search')
  // //   const start = v.get('query.page');
  // //   const pageCount = v.get('query.count');

  // //   const { rows, count } = await BlogArticle.scope('frontShow').findAndCountAll({
  // //     where: {
  // //       [Op.or]: [
  // //         {
  // //           title: {
  // //             [Op.like]: `${search}%`,
  // //           }
  // //         },
  // //         {
  // //           content: {
  // //             [Op.like]: `${search}%`,
  // //           }
  // //         }
  // //       ]
  // //     },
  // //     order: [
  // //       ['created_at', 'DESC']
  // //     ],
  // //     attributes: ['id', 'title', 'created_at', 'isTop'],
  // //     offset: start * pageCount,
  // //     limit: pageCount,
  // //   })

  // //   return {
  // //     articles: rows,
  // //     total: count
  // //   }
  // // }

  // 删除文章
  async delete(id) {
    const article = await BlogArticle.findOne({
      where: {
        id
      }
    })
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }

    // 删除相关关联
    // await ArticleUserDto.deleteArticleAuthor(id)
    await ArticleTagDto.deleteArticleTag(id)
    article.destroy()
  }

  // // 获取谋篇文章内容
  // async getContent(id) {
  //   const content = await BlogArticle.findOne({
  //     where: {
  //       id
  //     },
  //     attributes: ['content']
  //   })
  //   return content
  // }
}

module.exports = {
  ArticleDao
}
