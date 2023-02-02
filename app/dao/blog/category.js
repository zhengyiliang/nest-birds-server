const { NotFound, Forbidden } = require('@exception')
const { BlogCategory, BlogArticle } = require('@models')
const { byAuth } = require('@utils/util')
const { Op } = require('sequelize')

class CategoryDao {
  // 创建标签
  async create(v, user) {
    const category = await BlogCategory.findOne({
      where: {
        name: v.get('body.name'),
        ...byAuth(user, 'created_by_id')
      }
    })
    if (category) {
      throw new Forbidden('分类已存在')
    }
    return await BlogCategory.create({
      name: v.get('body.name'),
      description: v.get('body.description'),
      created_by: user.name,
      created_by_id: user.id
    })
  }
  // 根据id获取分类
  async getById(id, options = {}) {
    const category = await BlogCategory.findOne({
      where: {
        id
      },
      ...options
    })
    return category
  }
  // 获取分类列表
  async getList(v, currentUser) {
    const current = v.get('query.current')
    const pageSize = v.get('query.pageSize')

    const { rows, count } = await BlogCategory.findAndCountAll({
      distinct: true,
      attributes: { exclude: ['deleted_at'] },
      offset: (current - 1 > 0 ? current - 1 : 0) * pageSize,
      limit: pageSize * 1,
      where: {
        ...byAuth(currentUser, 'created_by_id')
      }
    })
    return {
      list: rows,
      total: count
    }
  }
  // 更新分类
  async update(v, id, update_by) {
    const category = await BlogCategory.findByPk(id)
    if (!category) {
      throw new NotFound('没有找到相关分类')
    }

    const name = v.get('body.name')
    const description = v.get('body.description')
    const sameName = await BlogCategory.findOne({
      where: {
        name,
        id: {
          [Op.ne]: id * 1
        }
      }
    })
    if (sameName) {
      throw new Forbidden('分类名称重复')
    }
    category.name = name
    category.description = description
    category.update_by = update_by
    category.save()
  }
  // 删除分类
  async delete(id) {
    const category = await BlogCategory.findOne({
      where: {
        id
      }
    })
    if (!category) {
      throw new NotFound('没有找到相关分类')
    }
    const article = await BlogArticle.findOne({
      where: {
        category_id: id
      }
    })
    if (article) {
      throw new Forbidden('该分类下有文章，禁止删除')
    }
    category.destroy()
  }

  // 获取所有标签
  async getAllList(user) {
    const categories = await BlogCategory.findAll({
      attributes: ['id', 'name'],
      where: {
        ...byAuth(user, 'created_by_id')
      }
    })
    return categories
  }
}

module.exports = {
  CategoryDao
}